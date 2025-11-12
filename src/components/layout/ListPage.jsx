import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Breadcrumbs,
  Link,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import PageContainer from './PageContainer';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function ListPage({ title, columns, rows, breadcrumbs, onAdd, onEdit, onDelete, onView }) {
  const [searchText, setSearchText] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const navigate = useNavigate();

  // Add id to rows for DataGrid and action buttons
  const rowsWithId = rows.map((row, index) => ({
    id: index + 1,
    ...row,
    actions: (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="View">
          <IconButton size="small" onClick={() => onView?.(row)} sx={{ color: '#7c3aed' }}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => onEdit?.(row)} sx={{ color: '#1976d2' }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => onDelete?.(row)} sx={{ color: '#f44336' }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  }));

  // Filter rows based on search
  const filteredRows = rowsWithId.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString()?.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  // Define columns with actions column
  const dataGridColumns = [
    ...columns.map((col) => ({
      field: col,
      headerName: col,
      width: col === 'Actions' ? 150 : 150,
      sortable: true,
      cellClassName: 'data-grid-cell',
    })),
  ];

  return (
    <PageContainer>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" onClick={() => navigate('/admin/dashboard')}>
            Dashboard
          </Link>
          <Typography color="text.primary">{title}</Typography>
        </Breadcrumbs>
      </Box>

      <Card
        sx={{
          borderRadius: '16px',
          boxShadow: 2,
          backgroundColor: '#ffffff',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header Section */}
          <Box sx={{
            p: 3,
            pb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1f2937' }}>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                size="small"
                placeholder="Search..."
                variant="outlined"
                value={searchText}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#6b7280' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: 300,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAdd}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#7c3aed',
                  '&:hover': {
                    backgroundColor: '#6b2fbc',
                  },
                  textTransform: 'none',
                }}
              >
                Add New
              </Button>
            </Box>
          </Box>

          <Divider />

          {/* Data Grid */}
          <Box sx={{
            height: 500,
            width: '100%',
            '& .MuiDataGrid-root': {
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #e5e7eb',
                '&:focus': {
                  outline: 'none',
                }
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: '#f8fafc',
                },
                '&:nth-of-type(even)': {
                  backgroundColor: '#f9fafb',
                },
                '&:nth-of-type(odd)': {
                  backgroundColor: '#ffffff',
                }
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f3f4f6',
                borderBottom: '1px solid #e5e7eb',
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 600,
                  color: '#374151',
                }
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: '#f3f4f6',
                borderTop: '1px solid #e5e7eb',
              },
              '& .MuiDataGrid-row.Mui-selected': {
                backgroundColor: '#ede9fe',
              }
            }
          }}>
            <DataGrid
              rows={filteredRows}
              columns={dataGridColumns}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
              density="standard"
              disableRowSelectionOnClick
              sx={{
                border: 0,
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
