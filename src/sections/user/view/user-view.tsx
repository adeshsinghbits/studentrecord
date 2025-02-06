import{ useState, useEffect, useCallback,useId } from 'react';
import { collection, getDocs, setDoc, deleteDoc, doc} from 'firebase/firestore';

import { onAuthStateChanged } from 'firebase/auth';

import { Navigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import {MenuItem, Select, CircularProgress, InputLabel, FormControl } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { StudentTableRow } from '../user-table-row';
import { StudentTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { StudentProps } from '../user-table-row';


import { auth, db } from '../../../fireaseconfig/firebase';
// ----------------------------------------------------------------------

export function StudentView() {
  const table = useTable();
  const [students, setStudents] = useState<StudentProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newStudent, setNewStudent] = useState<StudentProps>({
    id:'',
    name: '',
    class: '',
    rollno: 0,
    section: '',
    email: '',
    age: 0,
    Gender:'',
    phone: 1234567890,
    fatherName: '',
    motherName: '',
    bloodGroup:'',
    address: '',
  });



  // Fetch students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const data = querySnapshot.docs.map((studentdata) => ({
        id: studentdata.id,
        ...studentdata.data(),
      })) as StudentProps[];
      setStudents(data);
    };

    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    try {
      setIsUploading(true);
  
      // Create a reference with an auto-generated ID
      const docRef = doc(collection(db, 'students'));
  
      // Set the student data, explicitly including the ID
      await setDoc(docRef, { ...newStudent, id: docRef.id });
  
      // Update local state with the new student
      setStudents((prev) => [...prev, { ...newStudent, id: docRef.id }]);
      setOpenModal(false);
    } catch (error) {
      console.error("Error adding student:", error);
    } finally {
      setIsUploading(false);
    }
  };
  

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'students', id));
      alert("dkkj")
      setStudents((prev) => prev.filter((studentdata) => studentdata.id !== id));
      table.onResetPage();
      setIsUploading(false);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };
  

  const dataFiltered: StudentProps[] = applyFilter({
    inputData: students,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Check if a user is authenticated
      setLoading(false); // Stop loading when authentication state is ready
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Students
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenModal(true)}
        >
          New Student
        </Button>
      </Box>

      <Card>
        <TextField
          label="Search by name"
          variant="outlined"
          value={filterName}
          onChange={(event) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          fullWidth
          margin="normal"
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <StudentTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={students.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    students.map((studentlist) => studentlist.id)
                  )
                }
                headLabel={[
                  { id: 'id', label: 'id' },
                  { id: 'Name', label: 'Name' },
                  { id: 'class', label: 'Class' },
                  {id:'rollNumber',label:'Roll Number'},
                  { id: 'section', label: 'Section' },
                  { id: 'email', label: 'Email' },
                  { id: 'age', label: 'Age' },
                  { id: 'Gender', label: 'Gender' },
                  { id: 'phone', label: 'phone' },
                  { id: 'fatherName', label: 'father\'s Name' },
                  { id: 'motherName', label: 'Mother\'s Name' },
                  { id: 'bloodGroup', label: 'bloodGroup' },
                  { id: 'address', label: 'Address' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <StudentTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteStudent(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, students.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={students.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* Add Student Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
      <Box component="form" onSubmit={handleAddStudent} 
         sx={{
          position: 'absolute',
          top: '70%',
          left: '35%',
          right: '5%',
          height:1000,
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 4,
          boxShadow: 24,
          borderRadius: 2,
        }}
      display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Name"
        name="name"
        value={newStudent.name}
        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
        required
      />
      <Box>
        <TextField
          label="Class"
          name="class"
          value={newStudent.class}
          onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
          required
        />
        <TextField
          label="Roll No"
          name="rollno"
          type="number"
          value={newStudent.rollno}
          onChange={(e) => setNewStudent({ ...newStudent, rollno: Number(e.target.value) })}
          required
        />
        <TextField
          label="Section"
          name="section"
          value={newStudent.section}
          onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
          required
        />
        <TextField
          label="Age"
          name="age"
          type="number"
          value={newStudent.age}
          onChange={(e) => setNewStudent({ ...newStudent, age: Number(e.target.value) })}
          required
        />
      </Box>
        <FormControl fullWidth>
        <InputLabel>Gender</InputLabel>
        <Select 
          value={newStudent.Gender} 
          onChange={(e) => setNewStudent({ ...newStudent, Gender: e.target.value })}
          label="Gender">
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Email"
        name="email"
        value={newStudent.email}
        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
        required
      />
      <TextField
        label="Phone"
        name="phone"
        type="number"
        value={newStudent.phone}
        onChange={(e) => setNewStudent({ ...newStudent, phone: Number(e.target.value) })}
        required
      />
      <TextField
        label="Father's Name"
        name="FatherName"
        type="text"
        value={newStudent.fatherName}
        onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
        required
      />
      <TextField
        label="Mother's Name"
        name="MotherName"
        type="text"
        value={newStudent.motherName}
        onChange={(e) => setNewStudent({ ...newStudent, motherName: e.target.value })}
        required
      />
      <FormControl fullWidth>
        <InputLabel>bloodGroup</InputLabel>
        <Select 
          value={newStudent.bloodGroup} 
          onChange={(e) => setNewStudent({ ...newStudent, bloodGroup: e.target.value })}
          label="bloodGroup">
          <MenuItem value="A+">A+</MenuItem>
          <MenuItem value="A-">A-</MenuItem>
          <MenuItem value="B+">B+</MenuItem>
          <MenuItem value="B-">B-</MenuItem>
          <MenuItem value="AB+">AB+</MenuItem>
          <MenuItem value="AB-">AB-</MenuItem>
          <MenuItem value="O+">O+</MenuItem>
          <MenuItem value="O-">O-</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Address"
        name="address"
        value={newStudent.address}
        onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
        required
      />
      <Button type="submit" variant="contained"
        onClick={handleAddStudent}
        disabled={isUploading}>
        {isUploading ? <CircularProgress size={24} /> : "Add Student"}
      </Button>
      </Box>
      </Modal>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
