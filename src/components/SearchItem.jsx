import { Autocomplete, TextField } from '@mui/material';
import { Box, Stack } from '@mui/system'
import React from 'react'

const products = ['Ladoo', 'Chikli', 'Namkin'];

const SearchItem = () => {
  return (
    <Box>
      <Stack spacing={2} sx={{ width: "100%", marginBottom: "5px" }}>
        <Autocomplete
            id="search-product"
            freeSolo
            options={products.map((option) => option)}
            renderInput={(params) => <TextField {...params} label="Search Products" />}
        />
      </Stack>
    </Box>
  )
}

export default SearchItem
