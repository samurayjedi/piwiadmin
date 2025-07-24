import { useTranslation } from 'react-i18next';
import { Form } from 'react-final-form';
import { Stepper, Step, StepLabel, StepContent } from '@mui/material';
import { useHandlers, useStepperContext } from './hooks';
import StepClientData from './StepClientData';
import StepSearchClient from './StepSearchClient';
import StepPayment from './StepPayment';

export default function PaymentStepper() {
  const { t } = useTranslation();
  const { activeStep } = useStepperContext();

  const { searchClientSubmit, clientDataSubmit, handleSellSubmit } =
    useHandlers();
  const onSubmit = (() => {
    switch (activeStep) {
      case 0:
        return searchClientSubmit;
      case 1:
        return clientDataSubmit;
      case 2:
        return handleSellSubmit;
      default:
        return () => {};
    }
  })();

  return (
    <Form
      subscription={{ submitting: true, pristine: true }}
      onSubmit={onSubmit}
      render={({ /** pristine, */ handleSubmit }) => (
        <form method="POST" onSubmit={handleSubmit}>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>{t('Search client')}</StepLabel>
              <StepContent>
                <StepSearchClient />
              </StepContent>
            </Step>
            <Step>
              <StepClientData />
            </Step>
            <Step>
              <StepLabel>{t('Payment')}</StepLabel>
              <StepContent>
                <StepPayment />
              </StepContent>
            </Step>
          </Stepper>
        </form>
      )}
    />
  );
}
