'use server';

export const getProductOptions = async (): Promise<{ label: string; value: string; }[]> => {
    const response = await fetch(`http://localhost:3000/api/products`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log(response);

    const data = await response.json();
    return data.map((option: { id: string; name: string; }) => ({
        label: option.name,
        value: option.id,
    }));
};