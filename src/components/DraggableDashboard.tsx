import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableSection } from './SortableSection';

interface DashboardSection {
  id: string;
  type: 'metrics' | 'target' | 'chart' | 'ai' | 'calendar';
  component: React.ReactNode;
}

interface DraggableDashboardProps {
  children: React.ReactNode;
  sections: DashboardSection[];
  onSectionsChange: (sections: DashboardSection[]) => void;
}

const DraggableDashboard: React.FC<DraggableDashboardProps> = ({
  sections,
  onSectionsChange,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((section) => section.id === active.id);
      const newIndex = sections.findIndex((section) => section.id === over.id);
      onSectionsChange(arrayMove(sections, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((section) => section.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-8">
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              id={section.id}
              type={section.type}
            >
              {section.component}
            </SortableSection>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableDashboard;