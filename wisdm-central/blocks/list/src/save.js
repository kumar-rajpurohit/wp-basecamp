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
    Select,
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
    const list_id = document.getElementsByClassName('wp-block-wisdm-central-list')[0].dataset.postId;
    const [users, setUserList] = useState([]);
    const [todolist, setTodoList] = useState(null);
    const [todos, setListTodos] = useState([]);
    const [loading, setLoader] = useState(false);

    const content = '';

    const project_data = useForm({
        initialValues: {
            name: '',
            description: '',
            members: [],
            all_projects_link: '/?post_type=wdm-central-project',
            parent_list_id: 0,
            id: 0
        }
    });

    useEffect(() => {
        setLoader(true);

        // Get List Details
        apiFetch({
            path: 'wp/v2/wisdm-central-todo-category/' + list_id,
            method: 'GET'
        }).then((list_data) => {
            if (list_data.hasOwnProperty('id')) {
                setTodoList(list_data);

                // Get parent project
                apiFetch({
                    path: 'wp/v2/wdm-central-project/',
                    method: 'GET'
                }).then((data) => {
                    data.map((project) => {
                        if (project.acf.project_parent_category === list_data.parent) {
                            project_data.setValues({
                                id: project.id,
                                name: project.title.rendered,
                                description: project.content.rendered,
                                members: project.acf.members,
                                project_link: project.link,
                                parent_list_id: project.acf.project_parent_category
                            });
                        }
                    });
                });
            }
            setLoader(false);
        });

        // Get List Todos
        apiFetch({
            path: 'wp/v2/wdm-central-to-do?wisdm-central-todo-category=' + list_id,
            method: 'GET'
        }).then((data) => {
            setListTodos(data);
            setLoader(false);
        });

        // Get site users
        apiFetch({
            path: 'wp/v2/users',
            method: 'GET'
        }).then((data) => {
            let user_list = [];
            data.map((user) => {
                user_list.push({
                    label: user.name,
                    value: user.id
                });
            })
            setUserList(user_list);
        });
    }, [])

    const refreshListTodos = () => {
        setLoader(true);
        apiFetch({
            path: 'wp/v2/wdm-central-to-do?wisdm-central-todo-category=' + list_id,
            method: 'GET'
        }).then((data) => {
            setListTodos(data);
            setLoader(false);
        });
    }

    const toggleTaskCompletion = (value, todo) => {
        setLoader(true);
        console.log(value);
        console.log(todo);
        apiFetch({
            path: "wp/v2/wdm-central-to-do/" + todo.id,
            method: "POST",
            data: {
                acf: {
                    task_complete: value ? ["Done"] : [],
                }
            }
        }).then((data) => {
            if (data.hasOwnProperty('id')) {
                showNotification({
                    title: 'Success !!',
                    message: 'Todo updated successfully',
                })
            }
            setLoader(false);
            refreshListTodos();
        });
    }

    const AddNewTodo = () => {
        const editor = useEditor({
            extensions: [
                StarterKit,
                Link
            ],
            content
        });

        const newtodo_form = useForm({
            initialValues: {
                checked: false,
                title: '',
                assigned_to: '',
                due_on: ''
            }
        });

        const handleErrors = (errors) => {
            if (errors.title) {
                showNotification({ message: 'Please correct the highlighted errors', color: 'red' });
            }
        };

        const createNewTodo = (values) => {
            setLoader(true);

            apiFetch({
                path: 'wp/v2/wdm-central-to-do/',
                method: 'POST',
                data: {
                    title: newtodo_form.values.title,
                    status: "publish",
                    content: editor.getHTML(),
                    acf: {
                        project_id: project_data.values.id,
                        task_complete: [],
                        due_on: getDateString(newtodo_form.values.due_on),
                        assigned_to: newtodo_form.values.assigned_to,
                    },
                    "wisdm-central-todo-category": parseInt(list_id)
                }
            }).then((data) => {
                if (data.hasOwnProperty('id')) {
                    showNotification({
                        title: 'Success !!',
                        message: 'New Todo created successfully',
                    })
                }
                setLoader(false);
                refreshListTodos();
            });
        }

        const getDateString = (date) => {
            return date.getFullYear() + "" + (date.getMonth() + 1) + "" + date.getDate();
        }

        const [opened, setOpened] = useState(false);

        return (
            <>
                <Modal
                    opened={opened}
                    size="xl"
                    onClose={() => setOpened(false)}
                    title="Create New Todo"
                >
                    <form onSubmit={newtodo_form.onSubmit(createNewTodo, handleErrors)}>
                        <TextInput
                            label="Todo Title"
                            placeholder="eg. Washing clothes"
                            withAsterisk
                            mb={10}
                            {...newtodo_form.getInputProps('title')}
                        />
                        <Select
                            data={users}
                            placeholder="Select User"
                            label="Assigned To"
                            {...newtodo_form.getInputProps('assigned_to')}
                        />
                        <DatePicker {...newtodo_form.getInputProps('due_on')} label="Due Date" placeholder='Select a Date' mb={20} />
                        <RichTextEditor editor={editor}>
                            <RichTextEditor.Toolbar sticky stickyOffset={60}>
                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Bold />
                                    <RichTextEditor.Italic />
                                    <RichTextEditor.Strikethrough />
                                    <RichTextEditor.ClearFormatting />
                                    <RichTextEditor.Code />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.H1 />
                                    <RichTextEditor.H2 />
                                    <RichTextEditor.H3 />
                                    <RichTextEditor.H4 />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Blockquote />
                                    <RichTextEditor.Hr />
                                    <RichTextEditor.BulletList />
                                    <RichTextEditor.OrderedList />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Link />
                                    <RichTextEditor.Unlink />
                                </RichTextEditor.ControlsGroup>
                            </RichTextEditor.Toolbar>

                            <RichTextEditor.Content />
                        </RichTextEditor>
                        <Button radius="lg" uppercase type='submit' mt={20}>
                            Add this Todo
                        </Button>
                    </form>
                </Modal>
                <Button radius="lg" uppercase onClick={() => setOpened(true)} mt={10}>
                    New Todo
                </Button>
            </>
        );
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
                                    <a href={"/todo-archive/?project=" + project_data.values.id}>
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
                                    <AddNewTodo />
                                </Grid.Col>
                            </Grid>
                        </Container>
                    </Header>}
                    styles={(theme) => ({
                        main: { backgroundColor: '#fffcf9' },
                    })}
                >
                    <Container size="sm" px="sm">
                        {null !== todolist && (
                            <>
                                <Title order={2}>{todolist.name}</Title>
                                <Text mb={20}>{todolist.description}</Text>
                                <SimpleGrid cols={1}>
                                    {0 < todos.length && todos.map((todo) => (
                                        <Grid>
                                            <Grid.Col span={2}>
                                                <Checkbox size='lg'checked={("Done" === todo.acf.task_complete[0]) ? true : false} onChange={(event) => toggleTaskCompletion(event.currentTarget.checked, todo)} />
                                            </Grid.Col>
                                            <Grid.Col span={10}>
                                                <a href={todo.link} style={{ textDecoration: 'none' }}>
                                                    <Title order={3}>{todo.title.rendered}</Title>
                                                </a>
                                            </Grid.Col>
                                        </Grid>
                                    ))}
                                </SimpleGrid>
                            </>
                        )}
                    </Container>
                </AppShell>
            </NotificationsProvider>
        </MantineProvider >
    );
}

document.addEventListener("DOMContentLoaded", function (event) {

    let elem = document.getElementsByClassName('wisdm-central-container-list');
    if (elem.length > 0) {
        ReactDOM.render(React.createElement(save), elem[0]);
    }
    document.getElementById('wpadminbar').style.display = 'none';

});