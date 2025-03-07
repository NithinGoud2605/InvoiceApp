import React, { useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { DndContext, closestCenter, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SingleItem from '../Items/SingleItem';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';

const Items = () => {
  const { control } = useFormContext();
  const { t } = useTranslation();
  const ITEMS_NAME = 'details.items';
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: ITEMS_NAME,
  });

  const addNewField = () => {
    append({ name: '', description: '', quantity: 0, unitPrice: 0, total: 0 });
  };

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        const oldIndex = fields.findIndex((item) => item.id === active.id);
        const newIndex = fields.findIndex((item) => item.id === over?.id);
        move(oldIndex, newIndex);
      }
    },
    [fields, move]
  );

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>{t("form.steps.lineItems.heading")}:</Typography>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {fields.map((field, index) => (
            <SingleItem
              key={field.id}
              name={ITEMS_NAME}
              index={index}
              fields={fields}
              field={field}
              moveFieldUp={(idx) => move(idx, idx - 1)}
              moveFieldDown={(idx) => move(idx, idx + 1)}
              removeField={remove}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={addNewField} sx={{ mt: 2 }}>
        {t("form.steps.lineItems.addNewItem")}
      </Button>
    </Box>
  );
};

export default Items;