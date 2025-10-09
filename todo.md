- [ ] Buttons need to give more feedback in the filter panel.

- [ ] Reset filter button should have a dedicated state to track deviation from default, not a JSON string comparison.
  - [ ] User might want the satisfaction of resetting even if default is the same as current.

- [x] Make toast 
  - [x] Share filter button should copy to clipboard and give feedback (e.g., "Copied!").

- [ ] Extract everything from app.tsx
  - [ ] Profiles + options (maybe introduce a context? instead of passing state getter and setter props)
  - [ ] Filter panel
  - [ ] Toast

- [x] Rethink share filter button :ugh:
  - [x] remove it for now