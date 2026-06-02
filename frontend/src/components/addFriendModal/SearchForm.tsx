import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { iFormValues } from "../chat/AddFriendModal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface SearchFormProps {
    register: UseFormRegister<iFormValues>;
    errors: FieldErrors<iFormValues>;
    loading: boolean;
    usernameValue: string;
    isFound: boolean | null;
    searchedUsername: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    onCancel?: () => void;
}

const SearchForm = ({ register, errors, loading, usernameValue, isFound, searchedUsername, onSubmit, onCancel }: SearchFormProps) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold">
                    Tìm bằng username
                </Label>
                <Input
                    id="username"
                    placeholder="Điền username vào đây ..."
                    className="glass border-border/50 focus:border-primary/50 transition-smooth"
                    {...register("username", {
                        required: "Username không được bỏ trống",
                    })}
                >
                </Input>
                {errors.username && (
                    <p className="errors-message">{errors.username.message}</p>
                )}
                {isFound === false && (
                    <span className="errors-message">
                        Không tìm thấy <span className="font-semibold">@{searchedUsername}</span>
                    </span>
                )}
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 glass hover:text-destructive"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                </DialogClose>
                <Button
                    type="submit"
                    disabled={loading || !usernameValue?.trim()}
                    className="flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth"
                >
                    {loading ? (
                        <span> Đang tìm ...</span>
                    ): (
                    <> <Search className="size-4 mr-2"/> tìm
                    </>
                         )}
                </Button>
            </DialogFooter>
        </form>
    )
}

export default SearchForm