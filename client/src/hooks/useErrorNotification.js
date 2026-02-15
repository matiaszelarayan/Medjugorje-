import { toast } from 'react-toastify';
import { useCallback } from 'react';

export const useErrorNotification = () => {
    const notifyError = useCallback((error, defaultMessage = "Ocurrió un error inesperado") => {
        let message = defaultMessage;

        if (error.response) {
            // Server responded with a status code other than 2xx
            const data = error.response.data;

            // 1. Custom Backend Format (errors nested in "errors")
            if (data?.errors) {
                const firstKey = Object.keys(data.errors)[0];
                if (firstKey) {
                    const firstError = data.errors[firstKey];
                    message = Array.isArray(firstError) ? `${firstKey}: ${firstError[0]}` : `${firstKey}: ${firstError}`;
                } else if (data.message) {
                    message = data.message;
                }
            }
            // 2. Custom Backend Format (just message)
            else if (data?.message) {
                message = data.message;
            }
            // 3. Standard DRF Format
            else if (typeof data === 'string') {
                message = data;
            } else if (data?.detail) {
                message = data.detail;
            } else if (typeof data === 'object') {
                // IMPORTANT: Ignore "success" field if present, it's just a boolean
                const keys = Object.keys(data).filter(k => k !== 'success');
                const firstKey = keys[0];

                if (firstKey) {
                    const firstError = data[firstKey];
                    message = Array.isArray(firstError) ? `${firstKey}: ${firstError[0]}` : `${firstKey}: ${firstError}`;
                }
            }
        } else if (error.request) {
            // Request was made but no response received
            message = "No se pudo conectar con el servidor. Verifique su conexión.";
        } else {
            // Something happened in setting up the request
            message = error.message;
        }

        toast.error(message);
    }, []);

    return { notifyError };
};
