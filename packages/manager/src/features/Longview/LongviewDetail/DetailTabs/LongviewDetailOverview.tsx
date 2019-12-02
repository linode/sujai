import { APIError } from 'linode-js-sdk/lib/types';
import { pathOr } from 'ramda';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Paper from 'src/components/core/Paper';
import { makeStyles, Theme } from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';
// import Select from 'src/components/EnhancedSelect/Select';
import Grid from 'src/components/Grid';
import { Props as LVDataProps } from 'src/containers/longview.stats.container';

import ActiveConnections from './ActiveConnections';
import IconSection from './IconSection';
import ListeningServices from './ListeningServices';

import {
  LongviewPortsResponse,
  LongviewTopProcesses
} from 'src/features/Longview/request.types';
import TopProcesses from './TopProcesses';

const useStyles = makeStyles((theme: Theme) => ({
  paperSection: {
    padding: theme.spacing(3) + 1,
    marginBottom: theme.spacing(1) + 3
  }
}));

interface Props {
  client: string;
  longviewClientData: LVDataProps['longviewClientData'];
  topProcessesData: LongviewTopProcesses;
  topProcessesLoading: boolean;
  topProcessesError?: APIError[];
  lastUpdated?: number;
  lastUpdatedError?: APIError[];
  listeningPortsLoading: boolean;
  listeningPortsError?: APIError[];
  listeningPortsData: LongviewPortsResponse;
}

export type CombinedProps = RouteComponentProps<{ id: string }> & Props;

export const LongviewDetailOverview: React.FC<CombinedProps> = props => {
  const classes = useStyles();
  const {
    lastUpdated,
    listeningPortsData,
    listeningPortsError,
    listeningPortsLoading,
    topProcessesData,
    topProcessesLoading,
    topProcessesError,
    lastUpdatedError
  } = props;

  /**
   * Show an error for the services/connections
   * tables if the request errors, or if there is
   * a lastUpdated error (which will happen in the
   * event of a network error)
   */
  const _hasError = listeningPortsError || lastUpdatedError;
  const portsError = Boolean(_hasError)
    ? pathOr<string>('Error retrieving data', [0, 'reason'], _hasError)
    : undefined;

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paperSection}>
            <Grid container justify="space-between" item xs={12} spacing={0}>
              <IconSection
                longviewClientData={props.longviewClientData}
                client={props.client}
              />

              <Grid item xs={12} md={4} lg={6}>
                Gauges
              </Grid>
              <TopProcesses
                topProcessesData={topProcessesData}
                topProcessesLoading={topProcessesLoading}
                topProcessesError={topProcessesError}
                lastUpdatedError={lastUpdatedError}
              />
            </Grid>
          </Paper>
        </Grid>
        <Grid
          container
          alignItems="flex-end"
          justify="space-between"
          item
          xs={12}
          spacing={0}
        >
          <Grid item>
            <Typography variant="h2">Resource Allocation History</Typography>
          </Grid>
          <Grid item>
            {/* TODO make this functional
              <Select
                options={rangeSelectOptions}
                defaultValue={rangeSelectOptions[0]}
                onChange={handleChartRangeChange}
                name="chartRange"
                id="chartRange"
                small
                label="Select Time Range"
                hideLabel
                isClearable={false}
                data-qa-item="chartRange"
              />
              */}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paperSection}>Graphs here</Paper>
        </Grid>
        <Grid container justify="space-between" item spacing={0}>
          <ListeningServices
            services={pathOr([], ['Ports', 'listening'], listeningPortsData)}
            servicesLoading={listeningPortsLoading && !lastUpdated}
            servicesError={portsError}
          />
          <ActiveConnections
            connections={pathOr([], ['Ports', 'active'], listeningPortsData)}
            connectionsLoading={listeningPortsLoading && !lastUpdated}
            connectionsError={portsError}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default React.memo(LongviewDetailOverview);
