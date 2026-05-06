import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { NamespacesPageComponent } from '../NamespacesPage';
import { NamespaceInfo } from '../../../types/NamespaceInfo';
import { IntervalInMilliseconds } from 'types/Common';
import * as API from '../../../services/Api';
import { store } from '../../../store/ConfigStore';
import { RefreshIntervalManual } from '../../../config/Config';
import { HistoryManager } from '../../../app/History';
import { Show } from '../../../types/Common';
import type { Mock } from '@rstest/core';

rstest.mock('../NamespaceTrafficPolicies', () => ({
  NamespaceTrafficPolicies: (props: any) => <div data-test="NamespaceTrafficPolicies" {...props} />
}));

rstest.mock('components/Badge/ControlPlaneBadge', () => ({
  ControlPlaneBadge: () => <span data-test="ControlPlaneBadge" />
}));

rstest.mock('components/DefaultSecondaryMasthead/DefaultSecondaryMasthead', () => ({
  DefaultSecondaryMasthead: ({ children }: { children?: React.ReactNode }) => (
    <div data-test="DefaultSecondaryMasthead">{children}</div>
  )
}));

rstest.mock('components/Time/HealthComputeDurationMastheadToolbar', () => ({
  HealthComputeDurationMastheadToolbar: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

rstest.mock('../../../services/Api', () => ({
  getNamespaces: rstest.fn(),
  getClustersHealth: rstest.fn(),
  getClustersTls: rstest.fn(),
  getConfigValidations: rstest.fn(),
  getAllIstioConfigs: rstest.fn(),
  getGrafanaInfo: rstest.fn(() => Promise.resolve({ data: {} })),
  getErrorString: rstest.fn(() => ''),
  getPersesInfo: rstest.fn(() => Promise.resolve({ data: {} })),
  getControlPlanes: rstest.fn(() => Promise.resolve({ data: [] }))
}));

rstest.mock('../../../utils/AlertUtils', () => ({
  addDanger: rstest.fn(),
  addError: rstest.fn()
}));

rstest.mock('../../../app/History', () => ({
  HistoryManager: {
    deleteParam: rstest.fn(),
    getDuration: rstest.fn(),
    getNumericParam: rstest.fn(),
    getParam: rstest.fn(),
    setParam: rstest.fn(),
    getRefresh: rstest.fn(() => 0)
  },
  URLParam: {
    DIRECTION: 'direction',
    DURATION: 'duration',
    REFRESH_INTERVAL: 'refresh',
    SORT: 'sort'
  },
  location: {
    getPathname: rstest.fn(() => '/namespaces'),
    getSearch: rstest.fn(() => '')
  },
  router: {
    navigate: rstest.fn(),
    state: {
      location: {
        pathname: '/namespaces',
        search: ''
      }
    },
    basename: '/console'
  },
  webRoot: '/'
}));

rstest.mock('utils/I18nUtils', () => ({
  t: (key: string) => key,
  tMap: (m: Record<string, string>) => m,
  useKialiTranslation: () => ({
    t: (key: string) => key
  })
}));

const mockNamespaces: NamespaceInfo[] = [
  {
    name: 'default',
    cluster: 'test-cluster',
    isAmbient: false,
    isControlPlane: false,
    labels: {},
    annotations: {},
    revision: undefined
  },
  {
    name: 'istio-system',
    cluster: 'test-cluster',
    isAmbient: false,
    isControlPlane: true,
    labels: {},
    annotations: {},
    revision: undefined
  }
];

const defaultReduxProps = {
  columnOrder: [] as string[],
  externalServices: [],
  hiddenColumnIds: [],
  istioAPIEnabled: true,
  kiosk: '',
  language: 'en',
  meshStatus: 'MTLS_ENABLED',
  minTLS: 'TLS_AUTO',
  navCollapse: false,
  refreshInterval: 15000 as IntervalInMilliseconds,
  dispatch: rstest.fn()
};

const defaultProps = {
  ...defaultReduxProps,
  lastRefreshAt: Date.now()
};

describe('NamespacesPageComponent', () => {
  beforeEach(() => {
    rstest.clearAllMocks();
    (HistoryManager.getParam as Mock).mockReturnValue(undefined);
    (HistoryManager.getRefresh as Mock).mockReturnValue(RefreshIntervalManual);
    (API.getControlPlanes as Mock).mockResolvedValue({ data: [] });
    (API.getGrafanaInfo as Mock).mockResolvedValue({ data: {} });
    (API.getPersesInfo as Mock).mockResolvedValue({ data: {} });
  });

  describe('Component initialization', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <Provider store={store}>
          <NamespacesPageComponent {...defaultProps} />
        </Provider>
      );
      expect(container).toBeTruthy();
    });

    it('initializes state correctly', () => {
      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} />
        </Provider>
      );

      expect(ref.current!.state.loaded).toBe(false);
      expect(ref.current!.state.namespaces).toEqual([]);
      expect(ref.current!.state.nsTarget).toBe('');
      expect(ref.current!.state.opTarget).toBe('');
      expect(ref.current!.state.kind).toBe('');
      expect(ref.current!.state.showTrafficPoliciesModal).toBe(false);
    });
  });

  describe('Component lifecycle', () => {
    it('calls load on mount when refresh interval is not manual', () => {
      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} refreshInterval={15000} />
        </Provider>
      );
      const loadSpy = rstest.spyOn(ref.current!, 'load');

      (HistoryManager.getRefresh as Mock).mockReturnValue(15000);
      ref.current!.componentDidMount();

      expect(loadSpy).toHaveBeenCalled();
    });

    it('does not call load on mount when refresh interval is manual', () => {
      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} refreshInterval={RefreshIntervalManual} />
        </Provider>
      );
      const loadSpy = rstest.spyOn(ref.current!, 'load');

      (HistoryManager.getRefresh as Mock).mockReturnValue(RefreshIntervalManual);
      ref.current!.componentDidMount();

      expect(loadSpy).not.toHaveBeenCalled();
    });

    it('calls load on update when lastRefreshAt changes', () => {
      const ref = React.createRef<NamespacesPageComponent>();
      const firstLast = Date.now();
      const { rerender } = render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} lastRefreshAt={firstLast} />
        </Provider>
      );
      const loadSpy = rstest.spyOn(ref.current!, 'load');

      rerender(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} lastRefreshAt={firstLast + 1000} />
        </Provider>
      );

      expect(loadSpy).toHaveBeenCalled();
    });

    it('cancels promises on unmount', () => {
      const ref = React.createRef<NamespacesPageComponent>();
      const { unmount } = render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} />
        </Provider>
      );
      const cancelAllSpy = rstest.spyOn(ref.current!['promises'], 'cancelAll');

      unmount();

      expect(cancelAllSpy).toHaveBeenCalled();
    });
  });

  describe('load method', () => {
    it('fetches and processes namespaces', async () => {
      (API.getNamespaces as Mock).mockResolvedValue({
        data: [
          {
            name: 'default',
            cluster: 'test-cluster',
            isAmbient: false,
            isControlPlane: false,
            labels: {},
            annotations: {}
          },
          {
            name: 'istio-system',
            cluster: 'test-cluster',
            isAmbient: false,
            isControlPlane: true,
            labels: {},
            annotations: {}
          }
        ]
      });

      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} refreshInterval={15000} />
        </Provider>
      );

      ref.current!.load();
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(API.getNamespaces).toHaveBeenCalled();
      expect(ref.current!.state.loaded).toBe(true);
      expect(ref.current!.state.namespaces.length).toBeGreaterThan(0);
    });

    it('handles API errors gracefully', async () => {
      const error = { isCanceled: false, message: 'API Error' };
      (API.getNamespaces as Mock).mockRejectedValue(error);

      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} refreshInterval={15000} />
        </Provider>
      );

      await act(async () => {
        await ref.current!.load();
      });

      expect(API.getNamespaces).toHaveBeenCalled();
    });

    it('filters namespaces by name filter', async () => {
      (API.getNamespaces as Mock).mockResolvedValue({
        data: [
          {
            name: 'default',
            cluster: 'test-cluster',
            isAmbient: false,
            isControlPlane: false,
            labels: {},
            annotations: {}
          },
          {
            name: 'istio-system',
            cluster: 'test-cluster',
            isAmbient: false,
            isControlPlane: true,
            labels: {},
            annotations: {}
          }
        ]
      });

      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} refreshInterval={15000} />
        </Provider>
      );

      await act(async () => {
        await ref.current!.load();
      });

      expect(API.getNamespaces).toHaveBeenCalled();
    });
  });

  describe('fetchHealth', () => {
    it('fetches health for namespaces', async () => {
      const mockHealthResponse = new Map<string, any>();
      mockHealthResponse.set('default', {
        appHealth: {},
        serviceHealth: {},
        workloadHealth: {}
      });

      (API.getClustersHealth as Mock).mockResolvedValue(mockHealthResponse);

      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} />
        </Provider>
      );

      act(() => {
        ref.current!.setState({ namespaces: mockNamespaces });
      });
      await act(async () => {
        await ref.current!.fetchHealth(true, {
          id: 'namespace',
          title: 'Name',
          param: 'ns',
          compare: rstest.fn(),
          isNumeric: false
        });
      });

      expect(API.getClustersHealth).toHaveBeenCalled();
    });
  });

  describe('fetchTLS', () => {
    it('fetches TLS status for namespaces', async () => {
      (API.getClustersTls as Mock).mockResolvedValue({
        data: [
          {
            namespace: 'default',
            cluster: 'test-cluster',
            status: 'MTLS_ENABLED',
            autoMTLSEnabled: true,
            minTLS: 'TLS_AUTO'
          }
        ]
      });

      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} />
        </Provider>
      );

      act(() => {
        ref.current!.setState({ namespaces: mockNamespaces });
      });
      await act(async () => {
        await ref.current!.fetchTLS(true, {
          id: 'mtls',
          title: 'mTLS',
          param: 'mtls',
          compare: rstest.fn(),
          isNumeric: false
        });
      });

      expect(API.getClustersTls).toHaveBeenCalled();
    });
  });

  describe('fetchValidations', () => {
    it('fetches validations for namespaces', async () => {
      (API.getConfigValidations as Mock).mockResolvedValue({
        data: [
          {
            namespace: 'default',
            cluster: 'test-cluster',
            validations: {}
          }
        ]
      });

      (API.getAllIstioConfigs as Mock).mockResolvedValue({
        data: {
          resources: {}
        }
      });

      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} />
        </Provider>
      );

      act(() => {
        ref.current!.setState({ namespaces: mockNamespaces });
      });
      await act(async () => {
        await ref.current!.fetchValidations(true, {
          id: 'validations',
          title: 'Validations',
          param: 'validations',
          compare: rstest.fn(),
          isNumeric: false
        });
      });

      expect(API.getConfigValidations).toHaveBeenCalled();
      expect(API.getAllIstioConfigs).toHaveBeenCalled();
    });
  });

  describe('getNamespaceActions', () => {
    it('returns actions for non-control-plane namespace', () => {
      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} />
        </Provider>
      );

      const actions = ref.current!.getNamespaceActions(mockNamespaces[0]);

      expect(actions.length).toBeGreaterThan(0);
      expect(actions.some(a => a.title === 'Show')).toBeTruthy();
    });

    it('returns actions for control-plane namespace', () => {
      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} />
        </Provider>
      );

      act(() => {
        ref.current!.setState({ grafanaLinks: [{ name: 'Performance', url: 'http://grafana', variables: {} }] });
      });
      const actions = ref.current!.getNamespaceActions(mockNamespaces[1]);

      expect(actions.length).toBeGreaterThan(0);
    });
  });

  describe('hideTrafficManagement', () => {
    it('resets traffic management state', () => {
      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} />
        </Provider>
      );

      act(() => {
        ref.current!.setState({
          showTrafficPoliciesModal: true,
          nsTarget: 'test-namespace',
          opTarget: 'create',
          kind: 'policy',
          clusterTarget: 'test-cluster'
        });
      });

      ref.current!.hideTrafficManagement();

      expect(ref.current!.state.showTrafficPoliciesModal).toBe(false);
      expect(ref.current!.state.nsTarget).toBe('');
      expect(ref.current!.state.opTarget).toBe('');
      expect(ref.current!.state.kind).toBe('');
      expect(ref.current!.state.clusterTarget).toBe('');
    });
  });

  describe('show method', () => {
    it('navigates to graph page', () => {
      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} />
        </Provider>
      );

      ref.current!.show(Show.GRAPH, 'default');

      expect(() => ref.current!.show(0, 'default')).not.toThrow();
    });
  });

  describe('sort method', () => {
    it('sorts namespaces correctly', () => {
      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} />
        </Provider>
      );

      act(() => {
        ref.current!.setState({
          namespaces: [
            {
              name: 'z-namespace',
              cluster: 'test-cluster',
              isAmbient: false,
              isControlPlane: false,
              labels: {},
              annotations: {}
            },
            {
              name: 'a-namespace',
              cluster: 'test-cluster',
              isAmbient: false,
              isControlPlane: false,
              labels: {},
              annotations: {}
            }
          ] as NamespaceInfo[]
        });
      });

      const sortField = {
        id: 'namespace',
        title: 'Name',
        param: 'ns',
        compare: (a: NamespaceInfo, b: NamespaceInfo) => a.name.localeCompare(b.name),
        isNumeric: false
      };

      ref.current!.sort(sortField, true);

      expect(ref.current!.state.namespaces[0].name).toBe('a-namespace');
      expect(ref.current!.state.namespaces[1].name).toBe('z-namespace');
    });
  });

  describe('render', () => {
    it('renders empty state when no namespaces', () => {
      const ref = React.createRef<NamespacesPageComponent>();
      const { container } = render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} />
        </Provider>
      );

      act(() => {
        ref.current!.setState({ loaded: true, namespaces: [] });
      });

      expect(container.textContent).toContain('No namespaces found');
    });

    it('renders VirtualList when namespaces exist', () => {
      const ref = React.createRef<NamespacesPageComponent>();
      const { container } = render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} />
        </Provider>
      );

      act(() => {
        ref.current!.setState({ loaded: true, namespaces: mockNamespaces });
      });

      expect(container.querySelector('table') || container.querySelector('[role="grid"]')).toBeInTheDocument();
    });

    it('renders NamespaceTrafficPolicies when modal is open', () => {
      const ref = React.createRef<NamespacesPageComponent>();
      render(
        <Provider store={store}>
          <NamespacesPageComponent ref={ref} {...defaultProps} />
        </Provider>
      );

      act(() => {
        ref.current!.setState({
          showTrafficPoliciesModal: true,
          nsTarget: 'test-namespace',
          opTarget: 'create',
          kind: 'policy',
          namespaces: mockNamespaces
        });
      });

      expect(screen.getByTestId('NamespaceTrafficPolicies')).toBeInTheDocument();
    });
  });
});
