'use server';

export const getUserOptions = async (): Promise<{ label: string; value: string; }[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}api/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data.map((option: { id: string; name: string; }) => ({
        label: option.name,
        value: option.id,
    }));
};