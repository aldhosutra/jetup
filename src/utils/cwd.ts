export class CWD {
	public static value = process.cwd();

	public static setValue(value: string) {
		CWD.value = value;
	}
}
