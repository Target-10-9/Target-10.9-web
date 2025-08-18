import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: (inputValue?: string) => void; // inputValue optionnel
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: string;
    inputProps?: {
        placeholder: string;
        value: string;
        onChange: (val: string) => void;
    };
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                              isOpen,
                                                              title = "Confirmation",
                                                              message,
                                                              onConfirm,
                                                              onCancel,
                                                              confirmText = "Oui",
                                                              cancelText = "Non",
                                                              confirmColor = "#e53e3e",
                                                              inputProps
                                                          }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <p className="mb-4">{message}</p>

                {inputProps && (
                    <input
                        type="text"
                        placeholder={inputProps.placeholder}
                        value={inputProps.value}
                        onChange={(e) => inputProps.onChange(e.target.value)}
                        className="w-full border p-2 rounded mb-4"
                    />
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => onConfirm(inputProps?.value)}
                        style={{ backgroundColor: confirmColor }}
                        className="px-4 py-2 text-white rounded hover:brightness-90"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
