import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function FaqLong() {
  const [expanded, setExpanded] = React.useState(null);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : null);
  };

  return (
    <Container
      id="faq"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        sx={{
          width: { md: '60%' },
          textAlign: { md: 'center' },
          mb: 4,
        }}
      >
        Frequently Asked Questions
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">What can I do with the free plan?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              Our free plan lets you create and download an unlimited number of invoices. However,
              contract management and direct sending to clients require the Premium Plan.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">How secure is my data?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              We use industry-leading encryption and cloud storage solutions. All data is
              regularly backed up, and our infrastructure is continually monitored for any security
              risks.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Can I cancel my Premium Plan anytime?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              Yes, you can cancel at any time. Your account will revert to the free plan, and
              you’ll keep access to invoice creation, but lose the premium features like contract
              management and custom dashboards.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Do you offer bulk or enterprise pricing?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              We do! If you have multiple users or large-scale invoice and contract needs,
              please contact our sales team at&nbsp;
              <Link href="mailto:enterprise@invoiceapp.com">enterprise@invoiceapp.com</Link>.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Is there a mobile app?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              Yes, we have mobile apps for both iOS and Android that let you create invoices,
              review contracts, and get real-time notifications on the go.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}
