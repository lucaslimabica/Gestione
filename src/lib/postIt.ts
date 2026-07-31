// Shared post-it priority constants: the select options and the default background color per priority

export const PRIORITY_OPTIONS = [
    { value: 1, label: 'Baixa' },
    { value: 2, label: 'Média' },
    { value: 3, label: 'Alta' },
];

// Default post-it background color for each priority level; user can still override it manually
export const PRIORITY_COLORS: Record<number, string> = {
    1: '#61ff05', 
    2: '#ffff00', 
    3: '#ff0404', 
};

export const getPriorityColor = (priority: number): string => PRIORITY_COLORS[priority] ?? PRIORITY_COLORS[1];
