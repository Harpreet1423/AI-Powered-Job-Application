import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Card } from '../ui/card';

const colorMap = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    trend: 'bg-blue-50 text-blue-600',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    trend: 'bg-green-50 text-green-600',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    trend: 'bg-purple-50 text-purple-600',
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    trend: 'bg-amber-50 text-amber-600',
  },
};

export default function StatsCard({ title, value, icon: Icon, trend, color = 'blue' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const colors = colorMap[color] || colorMap.blue;

  useEffect(() => {
    const numericValue = typeof value === 'number' ? value : parseInt(value, 10);
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    const duration = 600;
    const steps = 30;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), numericValue);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-3xl font-bold text-gray-900">{displayValue}</p>
            <p className="text-sm text-muted-foreground mt-1">{title}</p>
          </div>
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full',
              colors.bg
            )}
          >
            {Icon && <Icon className={cn('h-6 w-6', colors.text)} />}
          </div>
        </div>
        {trend && (
          <div className="mt-3">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                colors.trend
              )}
            >
              {trend}
            </span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
