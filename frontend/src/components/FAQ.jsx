// src/components/FAQ.jsx
import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQ() {
  const [expanded, setExpanded] = React.useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? [...expanded, panel] : expanded.filter((item) => item !== panel));
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
      <Typography component="h2" variant="h4" sx={{ width: { md: '60%' }, textAlign: { md: 'center' } }}>
        Frequently Asked Questions
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Accordion expanded={expanded.includes('panel1')} onChange={handleChange('panel1')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            <Typography variant="subtitle2">
              How do I contact customer support?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ maxWidth: { md: '70%' } }}>
              You can contact our support team at&nbsp;
              <Link href="mailto:support@email.com">support@email.com</Link>
              &nbsp;or call our toll-free number.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded.includes('panel2')} onChange={handleChange('panel2')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header">
            <Typography variant="subtitle2">
              Can I return the product if it doesn't meet my expectations?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ maxWidth: { md: '70%' } }}>
              Absolutely! We offer a hassle-free return policy. If you’re not completely satisfied, you can return the product within a specified period for a full refund or exchange.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded.includes('panel3')} onChange={handleChange('panel3')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3-content" id="panel3-header">
            <Typography variant="subtitle2">
              What makes your product unique?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ maxWidth: { md: '70%' } }}>
              Our product stands out due to its adaptability, durability, and innovative features designed to maximize user satisfaction.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded.includes('panel4')} onChange={handleChange('panel4')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4-content" id="panel4-header">
            <Typography variant="subtitle2">
              Is there a warranty on the product?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ maxWidth: { md: '70%' } }}>
              Yes, our product comes with a warranty that covers manufacturing defects and workmanship. Please refer to our warranty policy for more details.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}
