import {alpha, Theme} from "@mui/material";

export const CircularProgressStyle = {
    m: 5,
    position: 'absolute' as 'absolute',
    left: '50%'
}

export const ModalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    borderRadius: '8px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: '32px',
};

export const FullScreenStyle = {
    width: '90%',
    height: '90%'
}

export const RoundedStyle = {
    borderRadius: 2
}

export const SmallSizeIcon = {
    width: '24px',
    height: '24px'
}

export const MediumSizeIcon = {
    width: '36px',
    height: '36px',
}


export const LargeSizeIcon = {
    width: '64px',
    height: '64px',
}

export const OnHoverColoredStyle = {
    ":hover": {
        bgcolor: 'rgba(25, 118, 210, 0.08)',
        cursor: 'pointer'
    }
}

export const BackgroundTintStyle = {
    // bgcolor: 'rgba(25, 118, 210, 0.02)'
    bgcolor: '#FAFAFA'
}

export const animatedStyleWithColor = (theme: Theme) => {
    return {
        boxShadow: 0,
        transition: 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',

        ":hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.06),
            transform: 'scale(1.0125, 1.0125)',
            boxShadow: 2,
            cursor: 'pointer'
        }
    }
}

export const borderStyleWithColor = (theme: Theme) => {
    return {
        border: `solid 1px ${theme.palette.primary.main}`
    }
}

export const dashedStyleWithColor = (theme: Theme) => {
    const primary = theme.palette.primary.main
    return {
        backgroundImage: `repeating-linear-gradient(-58deg, ${primary}, ${primary} 16px, transparent 16px, transparent 26px, ${primary} 26px), repeating-linear-gradient(32deg, ${primary}, ${primary} 16px, transparent 16px, transparent 26px, ${primary} 26px), repeating-linear-gradient(122deg, ${primary}, ${primary} 16px, transparent 16px, transparent 26px, ${primary} 26px), repeating-linear-gradient(212deg, ${primary}, ${primary} 16px, transparent 16px, transparent 26px, ${primary} 26px)`,
        backgroundSize: "3px 100%, 100% 3px, 3px 100% , 100% 3px",
        backgroundPosition: '0 0, 0 0, 100% 0, 0 100%',
        backgroundRepeat: 'no-repeat',
    }
}
