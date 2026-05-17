import { useState } from 'react';
import { Box, Checkbox, Collapse, IconButton, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { collectDescendantLeafs, type PermissionNode } from '@/data/permissions';
import { matchSearch } from './types';

interface Props {
  node: PermissionNode;
  selected: Set<string>;
  toggle: (codes: string[], on: boolean) => void;
  search: string;
  defaultExpand?: boolean;
}

export default function PermNodeView({
  node,
  selected,
  toggle,
  search,
  defaultExpand = true,
}: Props) {
  const [open, setOpen] = useState(defaultExpand || !!search);
  const leafs = collectDescendantLeafs(node);
  const allSelected = leafs.length > 0 && leafs.every((c) => selected.has(c));
  const someSelected = !allSelected && leafs.some((c) => selected.has(c));
  if (!matchSearch(node, search)) return null;
  const isLeaf = !node.children?.length;

  return (
    <Box sx={{ pl: 1 }}>
      <Stack direction="row" alignItems="center" sx={{ py: 0.5 }}>
        {!isLeaf ? (
          <IconButton size="small" onClick={() => setOpen((s) => !s)}>
            {open ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        ) : (
          <Box sx={{ width: 28 }} />
        )}
        <Checkbox
          size="small"
          checked={isLeaf ? selected.has(node.code) : allSelected}
          indeterminate={!isLeaf && someSelected}
          onChange={(e) => {
            if (isLeaf) toggle([node.code], e.target.checked);
            else toggle(leafs, e.target.checked);
          }}
        />
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: isLeaf ? 400 : 600,
            color: 'text.primary',
          }}
        >
          {node.label}
          {isLeaf && (
            <Typography component="span" sx={{ fontSize: 11, color: 'text.secondary', ml: 1 }}>
              {node.code}
            </Typography>
          )}
        </Typography>
      </Stack>
      {!isLeaf && (
        <Collapse in={open} unmountOnExit>
          <Box sx={{ pl: 2, borderLeft: '1px dashed #E6EFFF', ml: 2 }}>
            {node.children!.map((c) => (
              <PermNodeView
                key={c.code}
                node={c}
                selected={selected}
                toggle={toggle}
                search={search}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}
