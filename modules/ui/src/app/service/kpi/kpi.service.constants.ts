const KPI_BASE_URL = '/api/v1/kpi';

const getProjectCountUrl = (owner: string) => `${KPI_BASE_URL}/projects/${owner}/count`;

const getSupportTicketCountUrl = (owner: string) => `${KPI_BASE_URL}/srs/${owner}/count`;

const getRevenueUrl = (owner: string) => `${KPI_BASE_URL}/revenue/${owner}`;

const getClientsInLastMonthUrl = (owner: string) => `${KPI_BASE_URL}/clients/${owner}/new`;

const getSalesTrend = (owner: string) => `${KPI_BASE_URL}/sales/${owner}/monthly`;

export const KpiServiceConstants = {
  KPI_BASE_URL,
  getProjectCountUrl,
  getSupportTicketCountUrl,
  getRevenueUrl,
  getClientsInLastMonthUrl,
  getSalesTrend,
};
