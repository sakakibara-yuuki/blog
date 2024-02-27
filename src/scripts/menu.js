/*
 * menu.js
 * Copyright (C) 2024 sakakibara <sakakibara@organon>
 *
 * Distributed under terms of the MIT license.
 */

document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('expanded');
});
