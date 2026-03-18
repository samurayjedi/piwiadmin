import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useAppPage } from '@/hooks';
import {
  Paper as MUIPaper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/src/Layouts/AppLayout';
import Gap from '@/src/lib/piwi/common/Gap';
import Select from '@/src/lib/piwi/core/Select';
import Qz from './Qz';

export default function ESCPos() {
  const { t } = useTranslation();
  const { file } = useAppPage().props;
  const [step, setStep] = useState(0);
  const [connected, setConnected] = useState(false);
  const [found, setFound] = useState(false);
  const [printers, setPrinters] = useState<string[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string | undefined>(
    undefined,
  );
  const [printed, setPrinted] = useState(false);
  const [errorConnect, setErrorConnect] = useState(false);
  const [errorFindPrinters, setErrorFindPrinters] = useState(false);
  const [errorPrint, setErrorPrint] = useState(false);

  useEffect(() => {
    Qz.startConnection('localhost', false)
      .then(() => {
        setConnected(true);
        setStep(1);
      })
      .catch(() => {
        setErrorConnect(true);
      });

    return () => {
      Qz.endConnection();
    };
  }, []);

  useEffect(() => {
    if (connected) {
      Qz.findPrinters()
        .then((prs) => {
          setFound(true);
          setPrinters(prs);
          if (prs.length === 1) {
            setSelectedPrinter(prs[0]);
            setStep(3);
          } else {
            setStep(2);
          }
        })
        .catch(() => {
          setErrorFindPrinters(true);
        });
    }
  }, [connected]);

  useEffect(() => {
    if (selectedPrinter) {
      Qz.print(`/storage/tmp/${file}`, selectedPrinter)
        .then(() => {
          setStep(4);
          setPrinted(true);
        })
        .catch(() => setErrorPrint(true));
    }
  }, [selectedPrinter]);

  useEffect(() => {
    if (printed) {
      setTimeout(() => {
        router.get(route('sales'));
      }, 1500);
    }
  }, [printed]);

  return (
    <AppLayout>
      <Paper>
        <Stepper activeStep={step} orientation="vertical">
          <Step completed={step > 0}>
            <StepLabel
              error={errorConnect}
              optional={
                errorConnect && (
                  <Typography variant="caption" color="error">
                    {t(
                      "Check if QZ tray it's open or contact the system admnistrator.",
                    )}
                  </Typography>
                )
              }
            >
              {connected
                ? t('Connected to Qz tray.')
                : errorConnect
                  ? t('Failed to connect with QZ tray.')
                  : t('Connecting to QZ tray...')}
            </StepLabel>
          </Step>
          <Step completed={step > 1}>
            <StepLabel
              error={errorFindPrinters}
              optional={
                errorFindPrinters && (
                  <Typography variant="caption" color="error">
                    {t(
                      'Failed to get the list of ESC/POS printers installed or none are connected.',
                    )}
                  </Typography>
                )
              }
            >
              {found
                ? t('x device(s) has been found.', { x: printers.length })
                : step === 1
                  ? errorFindPrinters
                    ? t('Failed to get list of printers.')
                    : t('Finding ESC/POS printers...')
                  : t('Find ESC/POS printers.')}
            </StepLabel>
          </Step>
          <Step completed={step > 2}>
            <StepLabel>
              {selectedPrinter
                ? t('Printer x was selected', { x: selectedPrinter })
                : t('Choose printer.')}
            </StepLabel>
            <StepContent>
              <Typography>
                {t(
                  'Here are list the detected ESC/POS printers, if there are several printers detected, please choose which one of them you want print the invoice.',
                )}
              </Typography>
              <Gap />
              <Grid container>
                <Grid item xs={4}>
                  <Select
                    value={selectedPrinter}
                    label={t('Printers')}
                    items={printers}
                    variant="standard"
                    color="secondary"
                    fullWidth
                    onChange={(e) => {
                      setSelectedPrinter(e.target.value as string);
                      setStep(3);
                    }}
                  />
                </Grid>
              </Grid>
            </StepContent>
          </Step>
          <Step completed={step > 3}>
            <StepLabel
              error={errorPrint}
              optional={
                errorPrint && (
                  <Typography variant="caption" color="error">
                    {t(
                      'Failed sending the job to the printers, contact the administrator for details.',
                    )}
                  </Typography>
                )
              }
            >
              {step === 3
                ? errorPrint
                  ? t('Print failed.')
                  : t('Printing invoice...')
                : printed
                  ? t('Invoice printed.')
                  : t('Print invoice.')}
            </StepLabel>
            <StepContent>
              {!errorPrint && (
                <Typography>
                  {t('Please wait while the job is sended to the printer.')}
                </Typography>
              )}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>{t('Redirect.')}</StepLabel>
            <StepContent>
              <Typography>
                {t('Print successful, please wait while you are redirected...')}
              </Typography>
            </StepContent>
          </Step>
        </Stepper>
        {(errorConnect || errorFindPrinters || errorPrint) && (
          <Actions>
            <Actions>
              <Button
                variant="text"
                color="error"
                LinkComponent={Link}
                href={route('sales')}
              >
                {t('Omit')}
              </Button>
              <Button
                variant="text"
                color="warning"
                onClick={() => location.reload()}
              >
                {t('Retry')}
              </Button>
            </Actions>
          </Actions>
        )}
      </Paper>
    </AppLayout>
  );
}

const Paper = styled(MUIPaper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
}));

const Actions = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
});
