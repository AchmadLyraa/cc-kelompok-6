import { useState } from 'react'

export default function ItemForm({ onSubmit, type = 'transaction' }) {
  const [formData, setFormData] = useState({
    type: type === 'transaction' ? 'income' : '',
    category: '',
    amount: '',
    description: '',
    title: '',
    letterType: '',
    content: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      setFormData({
        type: type === 'transaction' ? 'income' : '',
        category: '',
        amount: '',
        description: '',
        title: '',
        letterType: '',
        content: '',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>{type === 'transaction' ? 'Add Transaction' : 'Add Letter'}</h3>
      
      {type === 'transaction' ? (
        <>
          <div style={styles.formGroup}>
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Salary">Salary</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Utilities">Utilities</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="0.00"
              step="0.01"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Transaction description"
            />
          </div>
        </>
      ) : (
        <>
          <div style={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Letter title"
            />
          </div>

          <div style={styles.formGroup}>
            <label>Letter Type</label>
            <select
              name="letterType"
              value={formData.letterType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="leave">Leave Request</option>
              <option value="promotion">Promotion Request</option>
              <option value="complaint">Complaint</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label>Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Letter content"
              rows="6"
            />
          </div>
        </>
      )}
      
      <button type="submit" style={styles.submitBtn} disabled={loading}>
        {loading ? 'Adding...' : 'Add'}
      </button>
    </form>
  )
}

const styles = {
  form: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    border: '1px solid #ddd',
  },
  formGroup: {
    marginBottom: '15px',
  },
  submitBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
}
