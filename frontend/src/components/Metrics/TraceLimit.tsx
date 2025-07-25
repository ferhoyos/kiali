import * as React from 'react';
import { Slider, SliderOnChangeEvent, Tooltip, TooltipPosition } from '@patternfly/react-core';
import { KialiIcon } from 'config/KialiIcon';
import { ToolbarDropdown } from 'components/Dropdown/ToolbarDropdown';
import { infoStyle } from 'styles/IconStyle';

type TraceLimitProps = {
  asRadio?: boolean;
  initialLimit?: number;
  onLimitChange: (limit: number) => void;
  title?: string;
  titleClassName?: string;
};

export const TRACE_LIMIT_DEFAULT = 100;
export type TraceLimitOption = 20 | 100 | 500 | 1000;

export const TraceLimit: React.FC<TraceLimitProps> = (props: TraceLimitProps) => {
  const initialLimit = props.initialLimit ?? TRACE_LIMIT_DEFAULT;
  const [limit, setLimit] = React.useState<number>(initialLimit);
  const [value, setValue] = React.useState<number>(initialLimit);

  const onLimitChange = (limitStr: string): void => {
    const limit = parseInt(limitStr);
    props.onLimitChange(limit);
    setLimit(limit);
  };

  const tooltip = (
    <Tooltip
      key="tooltip_limit_per_query"
      position={TooltipPosition.right}
      content={
        <div style={{ textAlign: 'left' }}>
          <div>
            This limits the number of traces that will be fetched. Each trace may have several spans. If the number of
            fetched traces does not sufficiently cover the desired time period, increase the limit or reduce the time
            period. Query time may increase for larger limits and/or time periods. A custom time period may also be
            used.
          </div>
        </div>
      }
    >
      <KialiIcon.Info className={infoStyle} />
    </Tooltip>
  );

  const traceLimits: { [key: string]: string } = {
    20: '20 traces',
    100: '100 traces',
    500: '500 traces',
    1000: '1000 traces'
  };

  const handleRelease = (): void => {
    if (value !== limit) {
      props.onLimitChange(value);
      setLimit(value);
    }
  };

  const traceLimitComponent = (
    <div>
      <div style={{ marginTop: '0.5rem' }}>
        <span className={props.titleClassName} style={{ paddingRight: 0 }}>
          {props.title} ({value})
        </span>
        {tooltip}
      </div>
      <div id="trace-limit" onMouseUp={handleRelease} style={{ padding: '0 10px' }}>
        <Slider
          value={value}
          onChange={(_event: SliderOnChangeEvent, value: number) => {
            setValue(value);
          }}
          min={10}
          max={1000}
          step={10}
        />
      </div>
    </div>
  );

  const traceLimitDropdownComponent = (
    <span>
      <ToolbarDropdown
        id="trace-limit-dropdown"
        handleSelect={onLimitChange}
        nameDropdown={props.title}
        nameDropdownClassName={props.titleClassName}
        value={limit}
        label={traceLimits[limit]}
        options={traceLimits}
      />
      {tooltip}
    </span>
  );

  return props.asRadio ? traceLimitComponent : traceLimitDropdownComponent;
};
