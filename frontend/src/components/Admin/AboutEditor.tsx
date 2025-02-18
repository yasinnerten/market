import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { endpoints } from '@/services/api';

export default function AboutEditor() {
    const [content, setContent] = React.useState('');

    const { isLoading } = useQuery({
        queryKey: ['about-content'],
        queryFn: () => endpoints.admin.getAboutContent().then(res => res.data),
    });

    const mutation = useMutation({
        mutationFn: (content: string) => endpoints.admin.updateAboutContent(content),
        onSuccess: () => {
            alert('Content updated successfully!');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(content);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Edit About Page</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter about page content..."
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
} 