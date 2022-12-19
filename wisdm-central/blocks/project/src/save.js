/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from 'react';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * Mantine Components
 */

import {
    AppShell,
    Navbar,
    Header,
    Accordion,
    MantineProvider,
    Text,
    Title,
    Grid,
    Paper,
    Input,
    Checkbox,
    Button,
    Group,
    Space,
    Center,
    CloseButton,
    Skeleton,
    TextInput,
    Modal,
    Tabs,
    FileButton,
    Switch,
    Radio,
    NumberInput,
    MultiSelect,
    Loader,
    Divider,
    Container,
    Card,
    Image,
    Badge,
    Textarea,
    Avatar,
    Tooltip
} from '@mantine/core';

import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { showNotification, NotificationsProvider } from '@mantine/notifications';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { IconArrowLeft } from '@tabler/icons';

/**
 * React Beautiful DnD Components
 */
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */

export default function save() {
    const post_id = document.getElementsByClassName('wp-block-wisdm-central-project')[0].dataset.postId;
    const [all_users, setAllUsers] = useState([]);
    const [user_data, setUserData] = useState([]);
    const [loading, setLoader] = useState(false);


    const project_data = useForm({
        initialValues: {
            name: '',
            description: '',
            members: [],
            all_projects_link: '/?post_type=wdm-central-project',
        }
    });

    const EditProjectModal = (props) => {
        const { project_data } = props;

        const updateproject_form = useForm({
            initialValues: {
                name: project_data.values.name,
                description: project_data.values.description,
                members: project_data.values.members
            }
        });

        const handleErrors = (errors) => {
            if (errors.title) {
                showNotification({ message: 'Please fill lesson title field', color: 'red' });
            }
        };

        const updateProject = (values) => {
            setLoader(true);

            apiFetch({
                path: 'wp/v2/wdm-central-project/' + post_id,
                method: 'POST',
                data: {
                    title: updateproject_form.values.name,
                    content: updateproject_form.values.description,
                    acf: {
                        members: updateproject_form.values.members
                    }
                }
            }).then((data) => {
                if (data.hasOwnProperty('id')) {
                    showNotification({
                        title: 'Success !!',
                        message: 'New Project created successfully',
                    })
                    setLoader(false);
                    refreshProjectData();
                }
            });
        }

        const [opened, setOpened] = useState(false);

        return (
            <>
                <Modal
                    opened={opened}
                    size="md"
                    onClose={() => setOpened(false)}
                    title="Edit Project Details"
                >
                    <form onSubmit={updateproject_form.onSubmit(updateProject, handleErrors)}>
                        <TextInput
                            label="Name this project"
                            placeholder="eg. Saaf Safai"
                            withAsterisk
                            mb={10}
                            {...updateproject_form.getInputProps('name')}
                        />
                        <Textarea
                            placeholder="eg. Poore ghar ki saaf safai for Diwali"
                            label="Add an optional description"
                            mb={10}
                            {...updateproject_form.getInputProps('description')}
                        />
                        <MultiSelect
                            data={all_users}
                            label="Add members to this project"
                            placeholder="eg. Mom, Dad, Bhai, Friends, etc "
                            mb={10}
                            {...updateproject_form.getInputProps('members')}
                        />
                        <Button radius="lg" uppercase type='submit'>
                            Update project
                        </Button>
                    </form>
                </Modal>
                <Button radius="lg" uppercase onClick={() => setOpened(true)} mt={10}>
                    Edit Project
                </Button>
            </>
        );
    }

    const refreshProjectData = () => {
        setLoader(true);
        // Get Project Details
        apiFetch({
            path: 'wp/v2/wdm-central-project/' + post_id,
            method: 'GET'
        }).then((data) => {
            project_data.setValues({
                name: data.title.rendered,
                description: data.content.rendered,
                members: data.acf.members
            })
            setLoader(false);
        });
    }

    useEffect(() => {
        setLoader(true);

        // Get Project Details
        apiFetch({
            path: 'wp/v2/wdm-central-project/' + post_id,
            method: 'GET'
        }).then((data) => {
            project_data.setValues({
                name: data.title.rendered,
                description: data.content.rendered,
                members: data.acf.members
            });
            setLoader(false);
        });

        // Get site users
        apiFetch({
            path: 'wp/v2/users',
            method: 'GET'
        }).then((data) => {
            setUserData(data);
            let user_list = [];
            data.map((user) => {
                user_list.push({
                    label: user.name,
                    value: user.id
                });
            })
            setAllUsers(user_list);
        });

    }, []);

    const MemberInfo = (props) => {
        const { member } = props;
        let avatar_url = '';
        let user_name = '';
        user_data.forEach(user => {
            if (user.id === member) {
                avatar_url = user.avatar_urls[96];
                user_name = user.name;
            }
        });

        if (0 < avatar_url.length) {
            return (
                <>
                    <Tooltip label={user_name} withArrow>
                        <Avatar src={avatar_url} alt={user_name} radius="xl" size="lg" />
                    </Tooltip>
                </>
            );
        }
    }

    return (
        <MantineProvider theme={{ colorScheme: 'light' }}>
            <NotificationsProvider>
                <AppShell
                    padding="md"
                    header={<Header height={60} p="xs">
                        <Container>
                            <Grid>
                                <Grid.Col span={2}>
                                    <a href={project_data.values.all_projects_link}>
                                        <IconArrowLeft
                                            size={28}
                                            color={'black'}
                                        />
                                    </a>
                                </Grid.Col>
                                <Grid.Col span={8}>
                                    <Center>
                                        <Title order={2}>{project_data.values.name}</Title>
                                        {true === loading && (<Loader variant="bars" size="sm" />)}
                                    </Center>
                                </Grid.Col>
                                <Grid.Col span={2}>
                                    <EditProjectModal project_data={project_data} />
                                </Grid.Col>
                            </Grid>
                        </Container>
                    </Header>}
                    styles={(theme) => ({
                        main: { backgroundColor: '#fffcf9' },
                    })}
                >
                    <Container size="sm" px="sm">
                        <Group mb={20}>
                            {0 < user_data.length && null !== project_data.values.members && project_data.values.members.map((member) => (
                                <MemberInfo member={member} />
                            ))}
                        </Group>
                        <Grid>
                            <Grid.Col span={6}>
                                <a href={"/message-board/?project="+post_id} style={{ textDecoration: 'none'}}>
                                    <Card shadow="sm" p="lg" radius="md" withBorder>
                                        <Card.Section withBorder inheritPadding py="xs">
                                            <Text weight={500}>Message Board</Text>
                                        </Card.Section>

                                        <Text size="sm" color="dimmed" p={5}>
                                            Posting in the Message Board of a project is ideal for making announcements, pitching ideas, asking questions to everyone on the project, and more.
                                        </Text>
                                    </Card>
                                </a>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <a href={"/todo-archive/?project="+post_id} style={{ textDecoration: 'none'}}>
                                    <Card shadow="sm" p="lg" radius="md" withBorder>
                                        <Card.Section withBorder inheritPadding py="xs">
                                            <Text weight={500}>To-dos</Text>
                                        </Card.Section>

                                        <Text size="sm" color="dimmed" p={5}>
                                            Every project you start automatically has the To-Do tool. Use this to make lists of tasks that need to get done, assign those out, and set due dates.
                                        </Text>
                                    </Card>
                                </a>
                            </Grid.Col>
                        </Grid>
                    </Container>
                </AppShell>
            </NotificationsProvider>
        </MantineProvider>
    );
}

document.addEventListener("DOMContentLoaded", function (event) {

    let elem = document.getElementsByClassName('wisdm-central-container-project');
    if (elem.length > 0) {
        ReactDOM.render(React.createElement(save), elem[0]);
    }
    document.getElementById('wpadminbar').style.display = 'none';

});