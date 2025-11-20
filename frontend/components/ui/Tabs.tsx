'use client';

import React from 'react';

type Tab = {
  value: string;
  label: string;
  description?: string;
};

type TabsProps = {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={`ui-tabs ${className ?? ''}`.trim()}>
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            className={`ui-tabs__tab ${isActive ? 'is-active' : ''}`.trim()}
            onClick={() => onChange(tab.value)}
          >
            <div>{tab.label}</div>
            {tab.description && <span className="text-muted" style={{ fontSize: '0.85rem' }}>{tab.description}</span>}
          </button>
        );
      })}
    </div>
  );
}
