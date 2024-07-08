import { Typography } from '@mui/material'

const Title = ({ title }) => {
	return (
		<>
			<Typography variant='h6'>{title}</Typography>
			<hr className='divider' />
		</>
	)
}

export default Title
