import React from "react";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import {OverridableStringUnion} from "@mui/types";
import {ButtonPropsVariantOverrides} from "@mui/material/Button/Button";

export const WorkScore: React.FC<{
    score: number
    variant?: OverridableStringUnion<'small' | 'standard', ButtonPropsVariantOverrides>
}> = React.memo(({score, variant}) => {
    const roundedScore = score ? Math.round(score) : 0
    const color = score < 40 ? "#e74c3c" : score < 60 ? "#f1c40f" : "#27ae60"
    const style = variant == "small" ? {width: 60, height: 60} : {width: 75, height: 75}

    return <div style={style}>
        <CircularProgressbar value={roundedScore} text={`${roundedScore}`} maxValue={100} strokeWidth={8}
                             styles={buildStyles({
                                 textSize: '2em',
                                 textColor: color,
                                 pathColor: color
                             })
                             }/>
    </div>
})