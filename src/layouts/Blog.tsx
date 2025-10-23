import type { ParentComponent } from 'solid-js';
import './Blog.css';

export const Blog: ParentComponent = (props) => {
  return (
    <div class="blog">
      <div class="blog__content">
        {props.children}
      </div>
    </div>
  )
}
