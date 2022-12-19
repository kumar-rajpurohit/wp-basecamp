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
    Textarea,
    TypographyStylesProvider
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
    const [users, setUserList] = useState(null);
    const [new_users, setNewUserList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoader] = useState(false);
    const project_id = getProjectIdFromUrl();

    const project_data = useForm({
        initialValues: {
            name: '',
            description: '',
            members: [],
            all_projects_link: '/?post_type=wdm-central-project',
        }
    });

    if (false === project_id) {
        window.location.replace( document.location.origin + "/?post_type=wdm-central-project" );
    }

    function getProjectIdFromUrl() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (urlParams.has('project')) {
            return parseInt(urlParams.get('project'));
        } else {
            return false;
        }
    }

    useEffect(() => {
        setLoader(true);
        // Get Project Details
        apiFetch({
            path: 'wp/v2/wdm-central-project/' + project_id,
            method: 'GET'
        }).then((data) => {
            project_data.setValues({
                name: data.title.rendered,
                description: data.content.rendered,
                members: data.acf.members,
                project_link: data.link
            });
            setLoader(false);
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

        // Get all messages.
        apiFetch({
            path: 'wp/v2/wdm-central-message/',
            method: 'GET'
        }).then((data) => {
            let _messages = [];
            data.map((message) => {
                if (project_id === message.acf.project) {
                    _messages.push(message);
                }
            })
            setMessages(_messages);
            setLoader(false);
        });

    }, [])

    const refreshMessageList = () => {
        setLoader(true);
        // Get Message List.
        apiFetch({
            path: 'wp/v2/wdm-central-message/',
            method: 'GET'
        }).then((data) => {
            let _messages = [];
            data.map((message) => {
                if (project_id === message.acf.project) {
                    _messages.push(message);
                }
            })
            setMessages(_messages);
            setLoader(false);
        });
    }

    const AddNewMessage = () => {
        const newmessage_form = useForm({
            initialValues: {
                category: null,
                title: '',
                description: ''
            }
        });

        const handleErrors = (errors) => {
            if (errors.title) {
                showNotification({ message: 'Please correct the highlighted errors', color: 'red' });
            }
        };

        const createNewMessage = (values) => {
            setLoader(true);

            apiFetch({
                path: 'wp/v2/wdm-central-message/',
                method: 'POST',
                data: {
                    title: newmessage_form.values.title,
                    status: "publish",
                    content: newmessage_form.values.description,
                    acf: {
                        project: project_id,
                    }
                }
            }).then((data) => {
                if (data.hasOwnProperty('id')) {
                    showNotification({
                        title: 'Success !!',
                        message: 'New Message created successfully',
                    })
                }
                setLoader(false);
                refreshMessageList();
            });
        }

        const [opened, setOpened] = useState(false);

        return (
            <>
                <Modal
                    opened={opened}
                    size="md"
                    onClose={() => setOpened(false)}
                    title="Create New Message"
                >
                    <form onSubmit={newmessage_form.onSubmit(createNewMessage, handleErrors)}>
                        <TextInput
                            label="Message Title"
                            placeholder="eg. Work on Project"
                            withAsterisk
                            mb={10}
                            {...newmessage_form.getInputProps('title')}
                        />
                        <Textarea
                            placeholder="eg. Poore ghar ki saaf safai for Diwali"
                            label="Add an optional description"
                            mb={10}
                            {...newmessage_form.getInputProps('description')}
                        />
                        <Button radius="lg" uppercase type='submit'>
                            Create new Message
                        </Button>
                    </form>
                </Modal>
                <Button radius="lg" uppercase onClick={() => setOpened(true)} mt={10}>
                    New Message
                </Button>
            </>
        );
    }

    const MemberInfo = (user_id) => {
        users.forEach(user => {
            if (user.id === user_id) {
                return (
                    <>
                        <Tooltip label={user.name} withArrow>
                            <Avatar src={user.avatar_urls[24]} radius="xl" />
                        </Tooltip>
                    </>
                );
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
                                    <a href={project_data.values.project_link}>
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
                                    <AddNewMessage />
                                </Grid.Col>
                            </Grid>
                        </Container>
                    </Header>}
                    styles={(theme) => ({
                        main: { backgroundColor: '#fffcf9' },
                    })}
                >
                    <Container size="sm" px="sm">
                        <SimpleGrid cols={1}>
                            {0 < messages.length && messages.map((message) => (
                                <a href={message.link} style={{ textDecoration: 'none' }}>
                                    <Text lineClamp={3} mb={10}>
                                        <TypographyStylesProvider>
                                            <Title order={3}>{message.title.rendered}</Title>
                                            <div dangerouslySetInnerHTML={{ __html: message.content.rendered }}></div>
                                        </TypographyStylesProvider>
                                    </Text>
                                    <Divider />
                                    {/* <div>
                                        <Text size="sm" lineClamp={4}>
                                            
                                        </Text>
                                    </div> */}
                                </a>
                            ))}
                        </SimpleGrid>
                    </Container>
                </AppShell>
            </NotificationsProvider>
        </MantineProvider >
    );
}

document.addEventListener("DOMContentLoaded", function (event) {

    let elem = document.getElementsByClassName('wisdm-central-container-board');
    if (elem.length > 0) {
        ReactDOM.render(React.createElement(save), elem[0]);
    }
    document.getElementById('wpadminbar').style.display = 'none';

});