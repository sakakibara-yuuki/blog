import './Button.css';
import { type ParentComponent, children } from 'solid-js';

export const Button: ParentComponent<{ onClick?: () => void }> = (props) => {
  const safeChildren = children(() => props.children);
  return (
    <button onClick={props.onClick} >
      {safeChildren()}
    </button>
  )
}

