import React from 'react';
import { Formik } from 'formik';

export default function AppForm({ initialValues, validationSchema, onSubmit, children }) {
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {() => <>{children}</>}
    </Formik>
  );
}
