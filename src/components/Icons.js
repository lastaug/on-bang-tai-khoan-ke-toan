// Clean SVG Icons conforming to Apple / Lucide style
import React from 'https://esm.sh/react@18.2.0';

export const createIcon = (svgPaths) => ({ size = 20, className = '', ...props }) => (
  React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    ...props
  }, svgPaths)
);

export const Icons = {
  BookOpen: createIcon([
    React.createElement('path', { key: 1, d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' }),
    React.createElement('path', { key: 2, d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' })
  ]),
  Sparkles: createIcon([
    React.createElement('path', { key: 1, d: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' }),
    React.createElement('path', { key: 2, d: 'M5 3v4' }),
    React.createElement('path', { key: 3, d: 'M19 17v4' }),
    React.createElement('path', { key: 4, d: 'M3 5h4' }),
    React.createElement('path', { key: 5, d: 'M17 19h4' })
  ]),
  Layers: createIcon([
    React.createElement('path', { key: 1, d: 'm12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z' }),
    React.createElement('path', { key: 2, d: 'm22 12.5-8.58 3.91a2 2 0 0 1-1.66 0L2 12.5' }),
    React.createElement('path', { key: 3, d: 'm22 17.5-8.58 3.91a2 2 0 0 1-1.66 0L2 17.5' })
  ]),
  Play: createIcon([
    React.createElement('polygon', { key: 1, points: '6 3 20 12 6 21 6 3' })
  ]),
  CheckCircle2: createIcon([
    React.createElement('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
    React.createElement('path', { key: 2, d: 'm9 12 2 2 4-4' })
  ]),
  XCircle: createIcon([
    React.createElement('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
    React.createElement('path', { key: 2, d: 'm15 9-6 6' }),
    React.createElement('path', { key: 3, d: 'm9 9 6 6' })
  ]),
  RotateCcw: createIcon([
    React.createElement('path', { key: 1, d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' }),
    React.createElement('path', { key: 2, d: 'M3 3v5h5' })
  ]),
  Shuffle: createIcon([
    React.createElement('path', { key: 1, d: 'M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22' }),
    React.createElement('path', { key: 2, d: 'm18 2 4 4-4 4' }),
    React.createElement('path', { key: 3, d: 'M2 6h1.9c1.5 0 2.9.9 3.6 2.2' }),
    React.createElement('path', { key: 4, d: 'M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.7l-.5-.8' }),
    React.createElement('path', { key: 5, d: 'm18 14 4 4-4 4' })
  ]),
  HelpCircle: createIcon([
    React.createElement('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
    React.createElement('path', { key: 2, d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' }),
    React.createElement('path', { key: 3, d: 'M12 17h.01' })
  ]),
  ArrowLeft: createIcon([
    React.createElement('path', { key: 1, d: 'm12 19-7-7 7-7' }),
    React.createElement('path', { key: 2, d: 'M19 12H5' })
  ]),
  ArrowRight: createIcon([
    React.createElement('path', { key: 1, d: 'M5 12h14' }),
    React.createElement('path', { key: 2, d: 'm12 5 7 7-7 7' })
  ]),
  Sun: createIcon([
    React.createElement('circle', { key: 1, cx: '12', cy: '12', r: '4' }),
    React.createElement('path', { key: 2, d: 'M12 2v2' }),
    React.createElement('path', { key: 3, d: 'M12 20v2' }),
    React.createElement('path', { key: 4, d: 'm4.93 4.93 1.41 1.41' }),
    React.createElement('path', { key: 5, d: 'm17.66 17.66 1.41 1.41' }),
    React.createElement('path', { key: 6, d: 'M2 12h2' }),
    React.createElement('path', { key: 7, d: 'M20 12h2' }),
    React.createElement('path', { key: 8, d: 'm6.34 17.66-1.41 1.41' }),
    React.createElement('path', { key: 9, d: 'm19.07 4.93-1.41 1.41' })
  ]),
  Moon: createIcon([
    React.createElement('path', { key: 1, d: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' })
  ]),
  Volume2: createIcon([
    React.createElement('polygon', { key: 1, points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5' }),
    React.createElement('path', { key: 2, d: 'M15.54 8.46a5 5 0 0 1 0 7.07' }),
    React.createElement('path', { key: 3, d: 'M19.07 4.93a10 10 0 0 1 0 14.14' })
  ]),
  VolumeX: createIcon([
    React.createElement('polygon', { key: 1, points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5' }),
    React.createElement('line', { key: 2, x1: '22', x2: '16', y1: '9', y2: '15' }),
    React.createElement('line', { key: 3, x1: '16', x2: '22', y1: '9', y2: '15' })
  ]),
  FolderPlus: createIcon([
    React.createElement('path', { key: 1, d: 'M12 10v6' }),
    React.createElement('path', { key: 2, d: 'M9 13h6' }),
    React.createElement('path', { key: 3, d: 'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z' })
  ]),
  Trash2: createIcon([
    React.createElement('path', { key: 1, d: 'M3 6h18' }),
    React.createElement('path', { key: 2, d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' }),
    React.createElement('path', { key: 3, d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' }),
    React.createElement('line', { key: 4, x1: '10', x2: '10', y1: '11', y2: '17' }),
    React.createElement('line', { key: 5, x1: '14', x2: '14', y1: '11', y2: '17' })
  ]),
  Edit3: createIcon([
    React.createElement('path', { key: 1, d: 'M12 20h9' }),
    React.createElement('path', { key: 2, d: 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z' })
  ]),
  Settings: createIcon([
    React.createElement('path', { key: 1, d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' }),
    React.createElement('circle', { key: 2, cx: '12', cy: '12', r: '3' })
  ]),
  BarChart3: createIcon([
    React.createElement('path', { key: 1, d: 'M3 3v18h18' }),
    React.createElement('path', { key: 2, d: 'M18 17V9' }),
    React.createElement('path', { key: 3, d: 'M13 17V5' }),
    React.createElement('path', { key: 4, d: 'M8 17v-3' })
  ]),
  Search: createIcon([
    React.createElement('circle', { key: 1, cx: '11', cy: '11', r: '8' }),
    React.createElement('path', { key: 2, d: 'm21 21-4.3-4.3' })
  ]),
  ChevronRight: createIcon([
    React.createElement('path', { key: 1, d: 'm9 18 6-6-6-6' })
  ]),
  ChevronDown: createIcon([
    React.createElement('path', { key: 1, d: 'm6 9 6 6 6-6' })
  ]),
  Check: createIcon([
    React.createElement('polyline', { key: 1, points: '20 6 9 17 4 12' })
  ]),
  Bookmark: createIcon([
    React.createElement('path', { key: 1, d: 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z' })
  ]),
  Star: createIcon([
    React.createElement('polygon', { key: 1, points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' })
  ]),
  Clock: createIcon([
    React.createElement('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
    React.createElement('polyline', { key: 2, points: '12 6 12 12 16 14' })
  ]),
  Trophy: createIcon([
    React.createElement('path', { key: 1, d: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6' }),
    React.createElement('path', { key: 2, d: 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18' }),
    React.createElement('path', { key: 3, d: 'M4 22h16' }),
    React.createElement('path', { key: 4, d: 'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22' }),
    React.createElement('path', { key: 5, d: 'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22' }),
    React.createElement('path', { key: 6, d: 'M18 2H6v7a6 6 0 0 0 12 0V2Z' })
  ]),
  Flame: createIcon([
    React.createElement('path', { key: 1, d: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z' })
  ]),
  Eye: createIcon([
    React.createElement('path', { key: 1, d: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' }),
    React.createElement('circle', { key: 2, cx: '12', cy: '12', r: '3' })
  ]),
  Filter: createIcon([
    React.createElement('polygon', { key: 1, points: '22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' })
  ]),
  RefreshCw: createIcon([
    React.createElement('path', { key: 1, d: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' }),
    React.createElement('path', { key: 2, d: 'M21 3v5h-5' }),
    React.createElement('path', { key: 3, d: 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' }),
    React.createElement('path', { key: 4, d: 'M8 16H3v5' })
  ]),
  X: createIcon([
    React.createElement('path', { key: 1, d: 'M18 6 6 18' }),
    React.createElement('path', { key: 2, d: 'm6 6 12 12' })
  ]),
  Plus: createIcon([
    React.createElement('path', { key: 1, d: 'M5 12h14' }),
    React.createElement('path', { key: 2, d: 'M12 5v14' })
  ]),
  Download: createIcon([
    React.createElement('path', { key: 1, d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
    React.createElement('polyline', { key: 2, points: '7 10 12 15 17 10' }),
    React.createElement('line', { key: 3, x1: '12', x2: '12', y1: '15', y2: '3' })
  ]),
  Upload: createIcon([
    React.createElement('path', { key: 1, d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
    React.createElement('polyline', { key: 2, points: '17 8 12 3 7 8' }),
    React.createElement('line', { key: 3, x1: '12', x2: '12', y1: '3', y2: '15' })
  ]),
  Info: createIcon([
    React.createElement('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
    React.createElement('path', { key: 2, d: 'M12 16v-4' }),
    React.createElement('path', { key: 3, d: 'M12 8h.01' })
  ]),
  Lightbulb: createIcon([
    React.createElement('path', { key: 1, d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5' }),
    React.createElement('path', { key: 2, d: 'M9 18h6' }),
    React.createElement('path', { key: 3, d: 'M10 22h4' })
  ]),
  GraduationCap: createIcon([
    React.createElement('path', { key: 1, d: 'M22 10v6M2 10l10-5 10 5-10 5z' }),
    React.createElement('path', { key: 2, d: 'M6 12v5c3 3 9 3 12 0v-5' })
  ]),
  Compass: createIcon([
    React.createElement('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
    React.createElement('polygon', { key: 2, points: '16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76' })
  ]),
  AlertCircle: createIcon([
    React.createElement('circle', { key: 1, cx: '12', cy: '12', r: '10' }),
    React.createElement('line', { key: 2, x1: '12', x2: '12', y1: '8', y2: '12' }),
    React.createElement('line', { key: 3, x1: '12', x2: '12.01', y1: '16', y2: '16' })
  ]),
  List: createIcon([
    React.createElement('line', { key: 1, x1: '8', x2: '21', y1: '6', y2: '6' }),
    React.createElement('line', { key: 2, x1: '8', x2: '21', y1: '12', y2: '12' }),
    React.createElement('line', { key: 3, x1: '8', x2: '21', y1: '18', y2: '18' }),
    React.createElement('line', { key: 4, x1: '3', x2: '3.01', y1: '6', y2: '6' }),
    React.createElement('line', { key: 5, x1: '3', x2: '3.01', y1: '12', y2: '12' }),
    React.createElement('line', { key: 6, x1: '3', x2: '3.01', y1: '18', y2: '18' })
  ]),
  Menu: createIcon([
    React.createElement('line', { key: 1, x1: '4', x2: '20', y1: '12', y2: '12' }),
    React.createElement('line', { key: 2, x1: '4', x2: '20', y1: '6', y2: '6' }),
    React.createElement('line', { key: 3, x1: '4', x2: '20', y1: '18', y2: '18' })
  ])
};
