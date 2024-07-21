import {
  Battery0Bar,
  Battery1Bar,
  Battery20,
  Battery30,
  Battery50,
  Battery60,
  Battery80,
  Battery90,
  BatteryAlert,
  BatteryFull,
  BatteryUnknown,
} from '@mui/icons-material';
import React from 'react';

interface BatteryLevelProps {
  batteryPercentage?: number;
}

export default function BatteryLevel({ batteryPercentage }: BatteryLevelProps) {
  let batteryIcon = <BatteryUnknown color="disabled" />;
  if (batteryPercentage !== undefined) {
    switch (true) {
      case batteryPercentage > 98:
        batteryIcon = <BatteryFull color="success" />;
        break;
      case batteryPercentage > 90:
        batteryIcon = <Battery90 color="success" />;
        break;
      case batteryPercentage > 80:
        batteryIcon = <Battery80 color="success" />;
        break;
      case batteryPercentage > 60:
        batteryIcon = <Battery60 />;
        break;
      case batteryPercentage > 50:
        batteryIcon = <Battery50 />;
        break;
      case batteryPercentage > 30:
        batteryIcon = <Battery30 color="warning" />;
        break;
      case batteryPercentage > 20:
        batteryIcon = <Battery20 color="warning" />;
        break;
      default:
        batteryIcon = <Battery0Bar color="error" />;
        break;
    }
  }
  return <React.Fragment>{batteryIcon}</React.Fragment>;
}
