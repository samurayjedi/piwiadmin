import React from 'react';
import _ from 'lodash';
import { Link as InertiaLink, InertiaLinkProps } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { route } from 'ziggy-js';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Typography,
  Skeleton,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useAppSelector } from '@/store/hooks';

export default function Breadcrumbs() {
  const { t } = useTranslation();

  const { pathname } = window.location;
  const paths = pathname
    .split('/')
    .filter((path) => path !== 'id' && isNaN(parseInt(path, 10)));

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      {paths.map((path, index) => [
        (() => {
          switch (path) {
            case '':
              return (
                <Link href="/">
                  <Typography variant="body1">
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    {t('Home')}
                  </Typography>
                </Link>
              );
            default:
              return index < paths.length - 1 ? (
                (() => {
                  let url = '';
                  try {
                    url = route(path);
                  } catch (error) {
                    if (error instanceof Error) {
                      const regex =
                        /Ziggy error: '(.+)' parameter is required for route '.+'\./;
                      const match = error.message.match(regex);
                      if (match && match[1]) {
                        const param = match[1];
                        url = route(path, { [param]: paths[paths.length - 1] });
                      }
                    }
                  }
                  return (
                    <Link href={url}>
                      <Typography>{t(_.startCase(path))}</Typography>
                    </Link>
                  );
                })()
              ) : (
                <LastItem>
                  <Typography>{t(_.startCase(path))}</Typography>
                </LastItem>
              );
          }
        })(),
      ])}
    </MuiBreadcrumbs>
  );
}

function LastItem({ children }: { children: React.ReactNode }) {
  const async = useAppSelector((state) => state.app.sync);

  if (async === 'ok') {
    return children;
  }

  return <Skeleton variant="text">{children}</Skeleton>;
}

function Link({ children, ...props }: InertiaLinkProps) {
  const async = useAppSelector((state) => state.app.sync);

  if (async === 'ok') {
    return <InertiaLink {...props}>{children}</InertiaLink>;
  }

  return <Skeleton variant="text">{children}</Skeleton>;
}
