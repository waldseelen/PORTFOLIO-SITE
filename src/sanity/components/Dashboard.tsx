'use client';

import { Button, Card, Container, Flex, Grid, Heading, Stack, Text } from '@sanity/ui';
import { useEffect, useState } from 'react';
import { useClient } from 'sanity';

export function Dashboard() {
    const client = useClient({ apiVersion: '2024-01-01' });
    const [stats, setStats] = useState({
        posts: 0,
        projects: 0,
        unreadMessages: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            const query = `{
        "posts": count(*[_type == "post"]),
        "projects": count(*[_type == "project"]),
        "unreadMessages": count(*[_type == "contactMessage" && read == false])
      }`;
            try {
                const result = await client.fetch(query);
                setStats(result);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };

        fetchStats();

        // Subscribe to real-time updates
        const subscription = client
            .listen(`*[_type in ["post", "project", "contactMessage"]]`)
            .subscribe(() => {
                fetchStats();
            });

        return () => subscription.unsubscribe();
    }, [client]);

    return (
        <Container width={4} padding={5}>
            <Stack space={5}>
                <Card padding={5} radius={4} shadow={1} tone="primary">
                    <Flex direction="column" align="center" justify="center" gap={3}>
                        <Heading as="h1" size={4} align="center">
                            👋 Hoş geldin, Buğra!
                        </Heading>
                        <Text align="center" muted>
                            Burası senin komuta merkezin. Buradan her şeyi yönetebilirsin.
                        </Text>
                    </Flex>
                </Card>

                <Grid columns={[1, 2, 3]} gap={4}>
                    {/* Posts Stat */}
                    <Card padding={4} radius={3} shadow={1}>
                        <Stack space={3}>
                            <Text size={1} weight="bold" muted>Toplam Blog Yazısı</Text>
                            <Heading size={4}>{stats.posts}</Heading>
                            <Text size={1} muted>Yayınlanmış içeriklerin</Text>
                        </Stack>
                    </Card>

                    {/* Projects Stat */}
                    <Card padding={4} radius={3} shadow={1}>
                        <Stack space={3}>
                            <Text size={1} weight="bold" muted>Projeler</Text>
                            <Heading size={4}>{stats.projects}</Heading>
                            <Text size={1} muted>Portfolyondaki işler</Text>
                        </Stack>
                    </Card>

                    {/* Unread Messages Stat */}
                    <Card padding={4} radius={3} shadow={1} tone={stats.unreadMessages > 0 ? 'critical' : 'positive'}>
                        <Stack space={3}>
                            <Text size={1} weight="bold" muted>Bekleyen Mesajlar</Text>
                            <Heading size={4}>{stats.unreadMessages}</Heading>
                            <Text size={1} muted>{stats.unreadMessages > 0 ? 'Hemen yanıtla!' : 'Her şey yolunda.'}</Text>
                        </Stack>
                    </Card>
                </Grid>

                <Card padding={4} radius={3} shadow={1}>
                    <Heading as="h2" size={2} style={{ marginBottom: '1rem' }}>Hızlı Aksiyonlar</Heading>
                    <Grid columns={[1, 2]} gap={3}>
                        <Button
                            text="Yeni Blog Yazısı Ekle"
                            tone="primary"
                            mode="ghost"
                            onClick={() => window.location.hash = '/intent/create/template=post;type=post/'}
                        />
                        <Button
                            text="Yeni Proje Ekle"
                            tone="primary"
                            mode="ghost"
                            onClick={() => window.location.hash = '/intent/create/template=project;type=project/'}
                        />
                    </Grid>
                </Card>
            </Stack>
        </Container>
    );
}
