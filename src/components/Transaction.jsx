// react
import { useNavigate } from 'react-router-dom';

// mui
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// hooks
import { useHttpClient } from '../hooks/http-hook';
import { useContext } from 'react';

// context
import { AuthContext } from '../context/auth-context';

export default function Transaction({ id, name, amount, onDelete }) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  const auth = useContext(AuthContext)

  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/transactions/${id}`, 
        'DELETE',
        null,
        {
          'Authorization': 'Bearer ' + auth.token
        }
      )
      onDelete(id)
    } catch (err) {
      // no need to do anything here since we're setting the error state in sendRequest()
    }
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          ${amount}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          onClick={() => navigate(`/transactions/${id}/edit`)}
          size="small"
        >
          Edit
        </Button>
        <Button 
          size="small"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}