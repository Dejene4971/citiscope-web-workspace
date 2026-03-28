# Button

The foundational interactive element in the CitiScope design system. Built as a native `<button>` with no MUI dependency, making it fully portable and independently testable.

## Usage

```tsx
import { Button } from '@citiscope/ui/atoms/Button';

<Button variant="primary" onClick={handleSubmit}>
  Submit Report
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'warning' \| 'success'` | `'primary'` | Semantic color variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Controls padding and font size |
| `loading` | `boolean` | `false` | Shows spinner, disables interaction |
| `disabled` | `boolean` | `false` | Disables the button |
| `fullWidth` | `boolean` | `false` | Stretches to fill container |
| `startIcon` | `ReactNode` | — | Icon before label |
| `endIcon` | `ReactNode` | — | Icon after label |
| `onClick` | `(e: MouseEvent) => void` | — | Click handler |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML type attribute |
| `aria-label` | `string` | — | Accessible label override |

## Variants

```tsx
<Button variant="primary">Submit</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete Issue</Button>
<Button variant="warning">Escalate</Button>
<Button variant="success">Resolve</Button>
```

## States

```tsx
<Button loading>Saving…</Button>
<Button disabled>Unavailable</Button>
```

## With Icons

```tsx
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

<Button startIcon={<AddIcon />}>New Report</Button>
<Button endIcon={<ArrowForwardIcon />}>Next</Button>
```

## Full Width

```tsx
<Button fullWidth variant="primary">
  Sign In
</Button>
```

## Accessibility

- Uses a native `<button>` element — keyboard and screen reader accessible by default.
- Sets `aria-busy="true"` during loading.
- Sets `aria-disabled="true"` when disabled or loading.
- `aria-label` prop available for icon-only buttons.
- Focus ring visible on `:focus-visible` (keyboard navigation only).

## Testing

```bash
pnpm --filter @citiscope/ui test
```
