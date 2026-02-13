import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { Product } from '../../types';

interface ProductInfoModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductInfoModal: React.FC<ProductInfoModalProps> = ({ open, onClose, product }) => {
  if (!product) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #E0E0E0',
        pb: 2,
        fontWeight: 600
      }}>
          Информация о товаре
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: { xs: '1', md: '0 0 300px' } }}>
            <Box
              component="img"
              src={product.thumbnail}
              alt={product.title}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              {product.title}
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Наименование
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                  {product.title}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Бренд
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                  {product.brand}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Артикул
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                  {product.sku}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Категория
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                  {product.category}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Цена
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 600 }}>
                  {product.price.toFixed(2)} ₽
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Рейтинг
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                  {product.rating} / 5
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Количество на складе
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                  {product.stock} шт.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Вес
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                  {product.weight} кг
                </Typography>
              </Box>

              {product.description && (
                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Описание
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {product.description}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductInfoModal;
