import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import { Delete } from '@mui/icons-material';
import { Box, Stack, styled } from '@mui/system'
import React, { useEffect, useState } from 'react'
import axios from "axios"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'black',
    color: 'white',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function SimpleDialog(props) {
  const { onSave, onClose, selectedValue, open, selectedItem } = props;
  const [qty, setQty] = useState(selectedValue);

  const handleClose = () => {
    setQty(selectedValue);
    onClose();
  };

  const handleQuntityClick = () => {
    const q = qty;
    setQty(selectedValue);
    onSave(q, selectedItem);
  };
  
  const handleChange = (event, item) => {
    let updatedQty = event.target.value;
    updatedQty = updatedQty < 1 ? 1 : updatedQty > item.stock ? item.stock : updatedQty;
    setQty(updatedQty);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Quantity</DialogTitle>
      <DialogContent>
          <DialogContentText>
            {selectedItem.itemName} - {selectedItem.sellingPriceInclTax}
          </DialogContentText>
          <TextField 
            autoFocus
            margin="dense"
            fullWidth
            variant="standard"
            type="number" 
            min="1" 
            max={selectedItem.stock} 
            value={qty} 
            onChange={event => {handleChange(event, selectedItem)}}
            InputProps={{endAdornment: <InputAdornment position="end">{selectedItem.unitOfMeasurement}</InputAdornment>}}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleQuntityClick}>Save</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
    </Dialog>
  );
}

const Leftbar = () => {
  const [searchword, setSearchword] = useState("");
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [total, setTotal] = useState(0);

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(1);
  const [selectedItem, setSelectedItem] = useState({});

  const handleClickOpen = (value, item) => {
    setSelectedItem(item);
    setSelectedValue(value);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedValue(1);
    setSelectedItem({})
  };

  const handleSave = (value, item) => {
    handleClose();
    handleItem(item.itemKey, value);
    handleCart(item, value)
  };

  const createItem = (itemKey, itemName, stock, sellingPriceExclTax, sgst, cgst, sellingPriceInclTax, unitOfMeasurement) => {
    return { itemKey, 
      itemName, 
      stock, 
      sellingPriceExclTax, 
      sgst, 
      cgst, 
      sellingPriceInclTax, 
      unitOfMeasurement
    };
  }

  const handleCart = (item, qty) => {
    let found = false;
    let updatedCart = cart.map((c) => {
      if (c.itemKey === item.itemKey) {
        found = true;
        return { ...c, quantity: qty};
      } else {
        return c;
      }
    });
    if(found === false) {
      updatedCart.push({...item, quantity: qty});
    }
    setCart(updatedCart);
  }

  const deleteItemFromCart = (item) => {
    setCart(cart.filter((c) => c.itemKey !== item.itemKey));
  }

  useEffect(() => {
    const updateCalculation = () => {
      let spet = 0;
      let spit = 0;
      let sgstVal = 0;
      let cgstVal = 0;
      cart.forEach((c)=> {
        spet += c.quantity * c.sellingPriceExclTax;
        spit += c.quantity * c.sellingPriceInclTax;
        sgstVal += (spet * c.sgst)/100;
        cgstVal += (spet * c.cgst)/100;
      });
      setSubTotal(spet);
      setTotal(spit);
      setSgst(sgstVal);
      setCgst(cgstVal);
    };
    updateCalculation();
  },[cart]);
  
  

  const handleItem = (itemKey, qty) => {
    let updatedItems = items.map((i) => {
      if (i.itemKey === itemKey) {
        return { ...i, quantity: qty};
      } else {
        return i;
      }
    });
    setItems(updatedItems);
  }

  useEffect(() => {
    const getItems = async() => {
      try {
        const res = await axios.get("/items",{})
        const data = [];
        res.data.map((item) => (data.push(createItem(item.itemKey, item.itemName, item.stock, item.sellingPriceExclTax, item.sgst, item.cgst, item.sellingPriceInclTax, item.unitOfMeasurement))));
        setItems(data)
      } catch (err) {
        console.log(err)
      }
    };
    getItems();
  },[]);
  const roundOff = (num) => Math.round(num * 100) / 100
  return (
    <Stack direction="row">
      <Box flex={2} p={2}>
        <TextField
        sx={{ marginTop: 0 }}
        fullWidth
        margin="normal" 
        label="Search Products" 
        onChange={(event) => setSearchword(event.target.value)}
        type="search"
        autoFocus/>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 700 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Key</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Stock</StyledTableCell>
                  <StyledTableCell>SP(ET)</StyledTableCell>
                  <StyledTableCell>SGST %</StyledTableCell>
                  <StyledTableCell>CGST %</StyledTableCell>
                  <StyledTableCell>SP(IT)</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.filter((item) =>item.itemName.toUpperCase().includes(searchword.toUpperCase())).map((item) => (
                  <StyledTableRow key={item.itemKey} hover onClick={() => handleClickOpen(1, item)}>
                    <StyledTableCell flex={1}>{item.itemKey}</StyledTableCell>
                    <StyledTableCell flex={2}>{item.itemName}</StyledTableCell>
                    <StyledTableCell flex={1}>{item.stock}</StyledTableCell>
                    <StyledTableCell flex={1}>{item.sellingPriceExclTax}</StyledTableCell>
                    <StyledTableCell flex={1}>{item.sgst}</StyledTableCell>
                    <StyledTableCell flex={1}>{item.cgst}</StyledTableCell>
                    <StyledTableCell flex={1}>{item.sellingPriceInclTax}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        onSave={handleSave}
        selectedItem={selectedItem}
      />
      </Box>
      <Box flex={2} p={2}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={3}>Details</TableCell>
                <TableCell align="center" colSpan={5}>Price</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Qty.</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">SP(ET)</TableCell>
                <TableCell align="right">CGST%</TableCell>
                <TableCell align="right">SGST%</TableCell>
                <TableCell align="right">SP(IT)</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.itemKey}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell align="right">{roundOff(item.quantity)}</TableCell>
                  <TableCell>{item.unitOfMeasurement}</TableCell>
                  <TableCell align="right">{roundOff(item.quantity * item.sellingPriceExclTax)}</TableCell>
                  <TableCell align="right">{roundOff(item.cgst)}</TableCell>
                  <TableCell align="right">{roundOff(item.sgst)}</TableCell>
                  <TableCell align="right">{roundOff(item.quantity * item.sellingPriceInclTax)}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => deleteItemFromCart(item)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell rowSpan={4} />
                <TableCell rowSpan={4} />
                <TableCell rowSpan={4} />
                <TableCell rowSpan={4} />
                <TableCell colSpan={2}>Subtotal</TableCell>
                <TableCell align="right">{subTotal}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>CGST</TableCell>
                <TableCell align="right">{cgst}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>SGST</TableCell>
                <TableCell align="right">{sgst}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell align="right">{total}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  )
}

export default Leftbar
