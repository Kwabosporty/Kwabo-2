import React from 'react';
import { FanZonePoll, FanZonePollProps } from './FanZonePoll';

export const FanZonePollWidget: React.FC<FanZonePollProps> = (props) => {
  return <FanZonePoll {...props} />;
};

export default FanZonePollWidget;
