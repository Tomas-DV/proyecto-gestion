"use client";
import { useColorModeValue } from "@/components/ui/color-mode";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { FiEdit, FiTrash2, FiClock, FiCalendar } from "react-icons/fi";
import { useRef } from "react";
import {
  Task,
  getStatusColor,
  getPriorityColor,
  getStatusLabel,
  getPriorityLabel,
} from "@/types/task";
import { useColorMode } from "@/components/ui/color-mode";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => Promise<boolean>;
  loading?: boolean;
}

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  loading = false,
}: TaskCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const { colorMode } = useColorMode();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Colores directos basados en colorMode
  const isDark = colorMode === "dark";
  const titleColor = isDark ? "white" : "gray.900";
  const descriptionColor = isDark ? "gray.200" : "gray.600";
  const metadataColor = isDark ? "gray.300" : "gray.500";
  
  const completedColor = isDark ? "green.200" : "green.500";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue = (dueDate?: string, status?: string) => {
  if (!dueDate) return false;

  const today = new Date();
  const due = new Date(dueDate);

  // Optional: ignore time and compare only dates
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return due < today && status !== "COMPLETED";
};


  const handleDelete = async () => {
    const success = await onDelete(task.id);

    if (success) {
      toast({
        title: "Tarea eliminada",
        description: "La tarea ha sido eliminada exitosamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }

    onClose();
  };

  return (
    <>
      <Box
        bg={cardBg}
        p={6}
        borderRadius="md"
        boxShadow="lg"
        border="1px"
        borderColor={borderColor}
        transition="all 0.2s"
        _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
        w="100%"
      >
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <VStack align="start" spacing={3} flex={1}>
            <HStack spacing={2} align="start" wrap="wrap">
              <Text fontWeight="semibold" fontSize="lg" color={titleColor}>
                {task.title}
              </Text>
              <Badge colorScheme={getStatusColor(task.status)}>
                {getStatusLabel(task.status)}
              </Badge>
              <Badge
                colorScheme={getPriorityColor(task.priority)}
                variant="outline"
              >
                {getPriorityLabel(task.priority)}
              </Badge>
            </HStack>

            {task.description && (
              <Text color={descriptionColor} fontSize="sm" noOfLines={3}>
                {task.description}
              </Text>
            )}

            <VStack align="start" spacing={1}>
              <HStack fontSize="xs" color={metadataColor}>
                <FiClock />
                <Text color={descriptionColor}>Creada: {formatDate(task.createdAt)}</Text>
              </HStack>

              const { colorMode } = useColorMode();

{task.dueDate && (
  <HStack fontSize="xs" align="center">
    <FiCalendar
      color={
        isOverdue(task.dueDate)
          ? "red"
          : colorMode === "light"
          ? "black"
          : "white"
      }
    />
    <Text
      color={
        isOverdue(task.dueDate)
          ? "red"
          : colorMode === "light"
          ? "black"
          : "white"
      }
    >
      Vence: {formatDate(task.dueDate)}
      {isOverdue(task.dueDate) && " (Vencida)"}
    </Text>
  </HStack>
)}



              {task.completedAt && (
                <HStack fontSize="xs" color={completedColor}>
                  <FiClock />
                  <Text color={descriptionColor}>Completada: {formatDate(task.completedAt)}</Text>
                </HStack>
              )}
            </VStack>
          </VStack>

          <VStack spacing={2} align="stretch">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(task)}
              isDisabled={loading}
              mr={4}
              leftIcon={<Icon as={FiEdit} />}
              color={useColorModeValue("gray.700", "white")}
            >
              Editar
            </Button>

            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={onOpen}
              isDisabled={loading}
              leftIcon={<Icon as={FiTrash2} />}
              color={useColorModeValue("red", "red")}
            >
              Eliminar
            </Button>
          </VStack>
        </Box>
      </Box>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Tarea
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que quieres eliminar la tarea {task.title}?
              Esta acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={loading}
                loadingText="Eliminando..."
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default TaskCard;
