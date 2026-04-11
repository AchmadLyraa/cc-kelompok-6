export default function ItemCard({ item, type = 'transaction', onDelete, onUpdate }) {
  if (type === 'transaction') {
    return (
      <div style={styles.card}>
        <div style={styles.header}>
          <h4>{item.description}</h4>
          <span style={{
            ...styles.badge,
            backgroundColor: item.type === 'income' ? '#27ae60' : '#e74c3c'
          }}>
            {item.type === 'income' ? '+' : '-'} ${item.amount.toFixed(2)}
          </span>
        </div>
        {item.category && <p style={styles.category}>Category: {item.category}</p>}
        <p style={styles.date}>{new Date(item.created_at || item.date).toLocaleDateString()}</p>
        <button
          onClick={() => onDelete(item.id)}
          style={styles.deleteBtn}
        >
          Delete
        </button>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h4>{item.title}</h4>
        <span style={{
          ...styles.badge,
          backgroundColor: getStatusColor(item.status)
        }}>
          {item.status}
        </span>
      </div>
      {item.letter_type && <p style={styles.category}>Type: {item.letter_type}</p>}
      <p style={styles.content}>{item.content.substring(0, 100)}...</p>
      <p style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</p>
      <div style={styles.actions}>
        {item.status === 'draft' && (
          <>
            <button
              onClick={() => onUpdate(item.id)}
              style={styles.editBtn}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(item.id)}
              style={styles.deleteBtn}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function getStatusColor(status) {
  switch(status) {
    case 'draft': return '#3498db'
    case 'submitted': return '#f39c12'
    case 'approved': return '#27ae60'
    case 'rejected': return '#e74c3c'
    default: return '#95a5a6'
  }
}

const styles = {
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '10px',
  },
  badge: {
    padding: '5px 10px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  content: {
    margin: '10px 0',
    color: '#666',
  },
  date: {
    fontSize: '12px',
    color: '#999',
    margin: '5px 0',
  },
  category: {
    fontSize: '13px',
    color: '#666',
    margin: '5px 0',
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  editBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '8px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
}
