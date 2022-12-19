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
    SimpleGrid,
    Avatar,
    Textarea
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
    const [projects, setProjects] = useState(null);
    const [users, setUserList] = useState(null);
    const [current_user, setCurrentUser] = useState(null);
    const [new_users, setNewUserList] = useState([]);
    const [loading, setLoader] = useState(false);

    useEffect(() => {
        setLoader(true);
        // Get current user details
        apiFetch({
            path: 'wp/v2/users/me',
            method: 'GET'
        }).then((userdata) => {
            setCurrentUser(userdata);

            // Get Project Name
            apiFetch({
                path: 'wp/v2/wdm-central-project/',
                method: 'GET'
            }).then((data) => {
                let _projects = [];
                data.map((project)=>{
                    if ( null !== project.acf.members && project.acf.members.includes(userdata.id) ) {
                        _projects.push(project);
                    }
                })
                setProjects(_projects);
                setLoader(false);
            });
        });

        // Get site users
        apiFetch({
            path: 'wp/v2/users',
            method: 'GET'
        }).then((data) => {
            setUserList(data);
            let user_list = [];
            data.map((user) => {
                user_list.push({
                    label: user.name,
                    value: user.id
                });
            })
            setNewUserList(user_list);
        });
    }, [])

    const refreshProjectList = () => {
        setLoader(true);
        // Get Project Name
        apiFetch({
            path: 'wp/v2/wdm-central-project/',
            method: 'GET'
        }).then((data) => {
            setProjects(data);
            setLoader(false);
        });
    }

    const AddNewProject = () => {
        const newproject_form = useForm({
            initialValues: {
                name: '',
                description: '',
                members: []
            }
        });

        const handleErrors = (errors) => {
            if (errors.title) {
                showNotification({ message: 'Please fill lesson title field', color: 'red' });
            }
        };

        const createNewProject = (values) => {
            setLoader(true);

            // Create new Todo parent category for todo lists.
            apiFetch({
                path: 'wp/v2/wisdm-central-todo-category/',
                method: 'POST',
                data: {
                    name: newproject_form.values.name,
                }
            }).then((data) => {
                if (data.hasOwnProperty('id')) {
                    apiFetch({
                        path: 'wp/v2/wdm-central-project/',
                        method: 'POST',
                        data: {
                            title: newproject_form.values.name,
                            status: "publish",
                            content: newproject_form.values.description,
                            acf: {
                                project_parent_category: data.id,
                                members: newproject_form.values.members
                            }
                        }
                    }).then((data) => {
                        if (data.hasOwnProperty('id')) {
                            showNotification({
                                title: 'Success !!',
                                message: 'New Project created successfully',
                            })
                        }
                        setLoader(false);
                        refreshProjectList();
                    });
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
                    title="Lets Start Something New!"
                >
                    <form onSubmit={newproject_form.onSubmit(createNewProject, handleErrors)}>
                        <TextInput
                            label="Name this project"
                            placeholder="eg. Saaf Safai"
                            withAsterisk
                            mb={10}
                            {...newproject_form.getInputProps('name')}
                        />
                        <Textarea
                            placeholder="eg. Poore ghar ki saaf safai for Diwali"
                            label="Add an optional description"
                            mb={10}
                            {...newproject_form.getInputProps('description')}
                        />
                        <MultiSelect
                            data={new_users}
                            label="Add members to this project"
                            placeholder="eg. Mom, Dad, Bhai, Friends, etc "
                            mb={10}
                            {...newproject_form.getInputProps('members')}
                        />
                        <Button radius="lg" uppercase type='submit'>
                            Create this project
                        </Button>
                    </form>
                </Modal>
                <Button radius="lg" uppercase onClick={() => setOpened(true)} mt={10}>
                    Make a New Project
                </Button>
            </>
        );
    }

    const getUserAvatar = (user_id) => {
        users.forEach(user => {
            if (user.id === user_id) {
                return user.avatar_urls[24];
            }
        });

        return '';
    }

    return (
        <MantineProvider theme={{
            colorScheme: 'light',
            fontFamily: 'Lato, sans-serif',
            fontFamilyMonospace: 'Lato, sans-serif',
            headings: { fontFamily: 'Lato, sans-serif' },
        }}>
            <NotificationsProvider>
                <AppShell
                    padding="md"
                    header={<Header height={60} p="xs">
                        <Container>
                            <Grid>
                                <Grid.Col span={2}>
                                    <Image src="/wp-content/plugins/wisdm-central/assets/wisdm-central-logo.png" height={60} />
                                </Grid.Col>
                                <Grid.Col span={8}>
                                    <Center>
                                        <Title order={2}>Home</Title>
                                        {true === loading && (<Loader variant="bars" size="sm" />)}
                                    </Center>
                                </Grid.Col>
                                <Grid.Col span={2}>
                                    <AddNewProject />
                                </Grid.Col>
                            </Grid>
                        </Container>
                    </Header>}
                    styles={(theme) => ({
                        main: { backgroundColor: '#fffcf9' },
                    })}
                >
                    <Container size="sm" px="sm">
                        <div style={{ width: 240, marginLeft: 'auto', marginRight: 'auto' }}>
                            <Image
                                radius="md"
                                src="/wp-content/plugins/wisdm-central/assets/wisdm-central-logo.png"
                                alt="WISDM CENTRAL"
                                p={20}
                            />
                        </div>
                        <SimpleGrid cols={3}>
                            {null !== projects && 0 < projects.length && projects.map((project) => (
                                <div>
                                    <Card shadow="sm" p="lg" radius="md" withBorder component="a" href={project.link} style={{ textDecoration: 'none' }}>
                                        <Card.Section withBorder inheritPadding py="xs">
                                            <Text weight={500}>{project.title.rendered}</Text>
                                        </Card.Section>
                                        <Card.Section>
                                            <Avatar.Group spacing="sm">
                                                {null !== users && null !== project.acf.members && project.acf.members.map((member) => (
                                                    <Avatar src={getUserAvatar(member)} />
                                                ))}
                                            </Avatar.Group>
                                        </Card.Section>
                                    </Card>
                                </div>
                            ))}
                        </SimpleGrid>
                    </Container>
                </AppShell>
            </NotificationsProvider>
        </MantineProvider>
    );
}

document.addEventListener("DOMContentLoaded", function (event) {

    let elem = document.getElementsByClassName('wisdm-central-container-home');
    if (elem.length > 0) {
        ReactDOM.render(React.createElement(save), elem[0]);
    }
    document.getElementById('wpadminbar').style.display = 'none';

});