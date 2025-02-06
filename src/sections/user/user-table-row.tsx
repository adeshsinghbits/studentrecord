import { useState, useCallback } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type StudentProps = {
  id: string;
  name: string;
  class: string;
  rollno: number;
  section: string;
  email: string;
  age: number;
  Gender:string;
  phone: number;
  fatherName:string;
  motherName:string;
  bloodGroup:string;
  address: string;
};

type UserTableRowProps = {
  row: StudentProps;
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function StudentTableRow({ row, selected, onSelectRow, onDeleteRow }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  // Helper to format enrollment date
  const formatDate = (date: number) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell  sx={{width:40}}>{row.id}</TableCell>
        <TableCell component="th" scope="row">{row.name}</TableCell>
        <TableCell>{row.class}</TableCell>
        <TableCell>{row.rollno}</TableCell>
        <TableCell>{row.section}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.age}</TableCell>
        <TableCell>{row.Gender}</TableCell>
        <TableCell>{row.phone}</TableCell>
        <TableCell>{row.fatherName}</TableCell>
        <TableCell>{row.motherName}</TableCell>
        <TableCell>{row.bloodGroup}</TableCell>
        <TableCell>{row.address}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >

          <MenuItem
            onClick={() => {
              handleClosePopover();
              onDeleteRow();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
