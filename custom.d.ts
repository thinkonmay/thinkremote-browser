declare module '*.svg' {
  import React = require('react');
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default ReactComponent;
}
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
