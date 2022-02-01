import { SxProps, Theme } from "@mui/material/styles";

export function getDefaultModalStyle(): SxProps<Theme> {
  return {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '12px',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    boxShadow: 24,
    p: 4,
  };
}
