# routes/

Componentes de **página** + configuração do router.

Uma route normalmente **compõe** features — não é uma feature em si:

```tsx
// routes/Dashboard.tsx
export default function Dashboard() {
    return (
        <Layout>
            <TasksList /> {/* de features/tasks */}
            <ProjectsSidebar /> {/* de features/projects */}
        </Layout>
    );
}
```

A configuração do router (`createBrowserRouter`) também vive aqui,
tipicamente em `routes/index.tsx` ou `routes/router.tsx`.
