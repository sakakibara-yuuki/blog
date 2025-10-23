import './Search.css';
import { Button } from '@components/Button';

export const Search = () => {
  return (
    <div class="search">
      <label for="site-search" />
      <input type="search" id="site-search" placeholder="python api ..." />
      <Button>search</Button>
    </div>
  )
}
