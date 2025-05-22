import React from 'react';
import {
  Pill,
  FileText,
  CheckSquare,
  RotateCcw,
  ClipboardList,
  Package,
  ShoppingCart,
  BarChart3,
  Stethoscope,
  Microscope,
  Dumbbell,
  Bed,
  Calendar,
  CreditCard,
  Truck,
  Droplets,
  Scissors,
  Users,
  Home,
  Settings
} from 'lucide-react';
import { ColoredIcon } from './ui/colored-icon';
import { ColoredIconButton } from './ui/colored-icon-button';
import { ColoredMenuItem } from './ui/colored-menu-item';
import { ActionCard, ActionCardGrid } from './ui/action-card';
import { StatsCard, StatsCardGrid } from './ui/stats-card';
import { ModuleMenu } from './ui/module-menu';

const IconTest: React.FC = () => {
  const colorVariants = [
    'blue',
    'green',
    'purple',
    'orange',
    'red',
    'teal',
    'indigo',
    'pink',
    'amber',
    'gray'
  ] as const;

  const icons = [
    { icon: Pill, name: 'Pill' },
    { icon: FileText, name: 'FileText' },
    { icon: CheckSquare, name: 'CheckSquare' },
    { icon: RotateCcw, name: 'RotateCcw' },
    { icon: ClipboardList, name: 'ClipboardList' },
    { icon: Package, name: 'Package' },
    { icon: ShoppingCart, name: 'ShoppingCart' },
    { icon: BarChart3, name: 'BarChart3' },
    { icon: Stethoscope, name: 'Stethoscope' },
    { icon: Microscope, name: 'Microscope' }
  ];

  const menuItems = [
    {
      id: 'dashboard',
      icon: Home,
      color: 'blue' as const,
      label: 'Dashboard'
    },
    {
      id: 'patients',
      icon: Users,
      color: 'green' as const,
      label: 'Patients',
      badge: { text: '5', color: 'blue' as const }
    },
    {
      id: 'appointments',
      icon: Calendar,
      color: 'purple' as const,
      label: 'Appointments'
    },
    {
      id: 'pharmacy',
      icon: Pill,
      color: 'orange' as const,
      label: 'Pharmacy'
    },
    {
      id: 'settings',
      icon: Settings,
      color: 'gray' as const,
      label: 'Settings'
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Colored Icons Demo</h1>

      <div className="space-y-12">
        {/* Basic Colored Icons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Basic Colored Icons</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {colorVariants.map(color => (
              <div key={color} className="flex flex-col items-center gap-2">
                <ColoredIcon icon={Pill} color={color} size="md" />
                <span className="text-sm font-medium">{color}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Outline Colored Icons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Outline Colored Icons</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {colorVariants.map(color => (
              <div key={color} className="flex flex-col items-center gap-2">
                <ColoredIcon icon={Pill} color={color} size="md" variant="outline" />
                <span className="text-sm font-medium">{color}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Icon Buttons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Icon Buttons</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {colorVariants.map(color => (
              <div key={color} className="flex flex-col items-center gap-2">
                <ColoredIconButton
                  icon={Pill}
                  color={color}
                  onClick={() => alert(`Clicked ${color} button`)}
                />
                <span className="text-sm font-medium">{color}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Menu Items */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Menu Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              {menuItems.map((item, index) => (
                <ColoredMenuItem
                  key={item.id}
                  icon={item.icon}
                  color={item.color}
                  label={item.label}
                  active={index === 0}
                  badge={item.badge}
                  onClick={() => alert(`Clicked ${item.label}`)}
                />
              ))}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <ModuleMenu
                title="Module Menu"
                items={menuItems}
                activeItemId="dashboard"
                onItemClick={(id) => alert(`Clicked menu item: ${id}`)}
              />
            </div>
          </div>
        </section>

        {/* Action Cards */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Action Cards</h2>
          <ActionCardGrid columns={4}>
            {icons.slice(0, 8).map((iconData, index) => (
              <ActionCard
                key={index}
                icon={iconData.icon}
                color={colorVariants[index % colorVariants.length]}
                title={iconData.name}
                description={`This is a ${colorVariants[index % colorVariants.length]} ${iconData.name} card`}
                onClick={() => alert(`Clicked ${iconData.name} card`)}
              />
            ))}
          </ActionCardGrid>
        </section>

        {/* Stats Cards */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Stats Cards</h2>
          <StatsCardGrid columns={3}>
            <StatsCard
              title="Patients"
              value={1234}
              icon={Users}
              color="blue"
              trend={{ value: 12, isPositive: true }}
              onClick={() => alert('Clicked Patients card')}
            />
            <StatsCard
              title="Appointments"
              value={56}
              icon={Calendar}
              color="green"
              trend={{ value: 8, isPositive: true }}
              onClick={() => alert('Clicked Appointments card')}
            />
            <StatsCard
              title="Pending Tests"
              value={23}
              icon={Microscope}
              color="purple"
              trend={{ value: 5, isPositive: false }}
              onClick={() => alert('Clicked Pending Tests card')}
            />
          </StatsCardGrid>
        </section>
      </div>
    </div>
  );
};

export default IconTest;
