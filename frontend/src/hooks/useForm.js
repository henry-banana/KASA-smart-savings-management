import { useState } from 'react';

export const useForm = (initialValues, validationSchema) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validationSchema?.[name]) {
      try {
        validationSchema[name](formData[name]);
      } catch (err) {
        setErrors(prev => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!validationSchema) return true;
    
    Object.keys(validationSchema).forEach(field => {
      try {
        validationSchema[field](formData[field]);
      } catch (err) {
        newErrors[field] = err.message;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setFormData(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setFormData,
    setErrors
  };
};
